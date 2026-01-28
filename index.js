const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    jidNormalizedUser, 
    makeCacheableSignalKeyStore, 
    delay 
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const readline = require("readline");
const { rmSync } = require('fs');
require('dotenv').config();

// --- Global Setup ---
global.isBotConnected = false;
global.errorRetryCount = 0;
global.messageBackup = {};
global.botname = "ISSA-BOT";
global.themeemoji = "•";

// --- Paths ---
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');
const loginFile = path.join(__dirname, 'login.json');
const MESSAGE_STORE_FILE = path.join(__dirname, 'message_backup.json');
const SESSION_ERROR_FILE = path.join(__dirname, 'sessionErrorCount.json');

// --- Logging ---
function log(message, color = 'white', isError = false) {
    const prefix = chalk.cyan.bold('[ ISSA-XMD ]');
    const logFunc = isError ? console.error : console.log;
    logFunc(`${prefix} ${chalk[color](message)}`);
}

// --- File Management ---
function loadStoredMessages() {
    try {
        if (fs.existsSync(MESSAGE_STORE_FILE)) {
            return JSON.parse(fs.readFileSync(MESSAGE_STORE_FILE, 'utf-8'));
        }
    } catch (error) { log(`Error loading message store: ${error.message}`, 'red', true); }
    return {};
}

function saveStoredMessages(data) {
    try {
        fs.writeFileSync(MESSAGE_STORE_FILE, JSON.stringify(data, null, 2));
    } catch (error) { log(`Error saving message store: ${error.message}`, 'red', true); }
}

function loadErrorCount() {
    try {
        if (fs.existsSync(SESSION_ERROR_FILE)) {
            return JSON.parse(fs.readFileSync(SESSION_ERROR_FILE, 'utf-8'));
        }
    } catch (error) { log(`Error loading error count: ${error.message}`, 'red', true); }
    return { count: 0, last_error_timestamp: 0 };
}

function saveErrorCount(data) {
    try {
        fs.writeFileSync(SESSION_ERROR_FILE, JSON.stringify(data, null, 2));
    } catch (error) { log(`Error saving error count: ${error.message}`, 'red', true); }
}

function deleteErrorCountFile() {
    try {
        if (fs.existsSync(SESSION_ERROR_FILE)) fs.unlinkSync(SESSION_ERROR_FILE);
    } catch (e) { log(`Failed to delete error file: ${e.message}`, 'red', true); }
}

function clearSessionFiles() {
    try {
        rmSync(sessionDir, { recursive: true, force: true });
        if (fs.existsSync(loginFile)) fs.unlinkSync(loginFile);
        deleteErrorCountFile();
        global.errorRetryCount = 0;
        log('✅ Session cleaned', 'green');
    } catch (e) { log(`Failed to clear session: ${e.message}`, 'red', true); }
}

// --- Login Management ---
async function saveLoginMethod(method) {
    await fs.promises.mkdir(path.dirname(loginFile), { recursive: true });
    await fs.promises.writeFile(loginFile, JSON.stringify({ method }, null, 2));
}

async function getLastLoginMethod() {
    if (fs.existsSync(loginFile)) {
        return JSON.parse(fs.readFileSync(loginFile, 'utf-8')).method;
    }
    return null;
}

function sessionExists() {
    return fs.existsSync(credsPath);
}

async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });
        if (!fs.existsSync(credsPath) && global.SESSION_ID) {
            const base64Data = global.SESSION_ID.includes("ISSA:~") ? 
                global.SESSION_ID.split("ISSA:~")[1] : global.SESSION_ID;
            await fs.promises.writeFile(credsPath, Buffer.from(base64Data, 'base64'));
            log('✅ Session saved', 'green');
        }
    } catch (err) { log(`Error downloading session: ${err.message}`, 'red', true); }
}

async function requestPairingCode(socket) {
    try {
        await delay(3000);
        let code = await socket.requestPairingCode(global.phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        log(chalk.bgGreen.black(`\nPairing Code: ${code}\n`), 'white');
        log('Enter code in WhatsApp: Settings → Linked Devices → Link a Device', 'blue');
        return true;
    } catch (err) { 
        log(`Failed to get pairing code: ${err.message}`, 'red', true); 
        return false; 
    }
}

// --- Session Validation ---
async function checkAndHandleSessionFormat() {
    const sessionId = process.env.SESSION_ID?.trim();
    if (sessionId && !sessionId.startsWith('ISSA:~')) {
        log(chalk.white.bgRed('[ERROR]: SESSION_ID must start with "ARYAN:~"'), 'white');
        log('Cleaning .env...', 'red');

        try {
            let envContent = fs.readFileSync('.env', 'utf8');
            envContent = envContent.replace(/^SESSION_ID=.*$/m, 'SESSION_ID=');
            fs.writeFileSync('.env', envContent);
            log('✅ Cleaned .env', 'green');
        } catch (e) { log(`Failed to modify .env: ${e.message}`, 'red', true); }

        await delay(20000);
        process.exit(1);
    }
}

async function checkSessionIntegrityAndClean() {
    if (fs.existsSync(sessionDir) && !sessionExists()) {
        log('⚠️ Cleaning incomplete session...', 'red');
        clearSessionFiles();
        await delay(3000);
    }
}

// --- Error Handling ---
async function handle408Error(statusCode) {
    if (statusCode !== DisconnectReason.connectionTimeout) return false;

    global.errorRetryCount++;
    const MAX_RETRIES = 3;
    const errorState = { count: global.errorRetryCount, last_error_timestamp: Date.now() };
    saveErrorCount(errorState);

    log(`Timeout (408). Retry: ${global.errorRetryCount}/${MAX_RETRIES}`, 'yellow');

    if (global.errorRetryCount >= MAX_RETRIES) {
        log(chalk.white.bgRed('[MAX TIMEOUTS REACHED]'), 'white');
        deleteErrorCountFile();
        global.errorRetryCount = 0;
        await delay(5000);
        process.exit(1);
    }
    return true;
}

// --- Bot Core ---
async function sendWelcomeMessage(XeonBotInc) {
    if (global.isBotConnected) return;
    await delay(10000);

    try {
        const pNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';

        // Auto-join group (optional)
        try {
            await XeonBotInc.groupAcceptInvite('Bhng5pe0yNNC7cpVu2OXNn');
            log('✅ Auto-joined WhatsApp group', 'blue');
        } catch (e) {
            log(`⚠️ Failed to join group: ${e.message}`, 'red');
        }

        await XeonBotInc.sendMessage(pNumber, {
            text: `┏━━━━━✧ CONNECTED ✧━━━━━━━
┃✧ Bot: ISSA-XMD
┃✧ Status: Active & Online
┃✧ Time: ${new Date().toLocaleString()}
┃✧ Platform: ${process.platform}
┃✧ Version: 1.0.0
┗━━━━━━━━━━━━━━━━━━━━━`
        });

        global.isBotConnected = true;
        deleteErrorCountFile();
        global.errorRetryCount = 0;
        log('✅ ISSA-XMD connected successfully', 'green');
    } catch (e) {
        log(`Welcome message error: ${e.message}`, 'red', true);
        global.isBotConnected = false;
    }
}

async function startXeonBotInc() {
    log('Connecting ARYAN-BOT...', 'cyan');
    const { version } = await fetchLatestBaileysVersion();
    await fs.promises.mkdir(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const msgRetryCounterCache = new NodeCache();

    const XeonBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => "",
        msgRetryCounterCache
    });

    // Load required modules
    const store = require('./lib/lightweight_store');
    const { smsg } = require('./lib/myfunc');
    const main = require('./main');
    store.bind(XeonBotInc.ev);
    store.readFromFile();

    // Message handling
    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;

        if (mek.key.remoteJid === 'status@broadcast') {
            await main.handleStatus(XeonBotInc, chatUpdate);
            return;
        }

        try {
            await main.handleMessages(XeonBotInc, chatUpdate, true);
        } catch(e) { log(e.message, 'red', true); }
    });

    // Group participants update
    XeonBotInc.ev.on('group-participants.update', async (update) => {
        await main.handleGroupParticipantUpdate(XeonBotInc, update);
    });

    // Connection handling
    XeonBotInc.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            global.isBotConnected = false;
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401;

            if (permanentLogout) {
                log(chalk.bgRed.black('🚨 Logged out / Invalid session'), 'white');
                clearSessionFiles();
                await delay(5000);
                process.exit(1);
            } else {
                const is408Handled = await handle408Error(statusCode);
                if (!is408Handled) startXeonBotInc();
            }
        } else if (connection === 'open') {
            console.log(chalk.yellow(`ISSA-XMD Connected: ${JSON.stringify(XeonBotInc.user.id)}`));
            log('ISSA-XMD Connected Successfully', 'green');

            // Display bot info
            console.log(chalk.cyan(`\n╔══════════════════════════════════╗`));
            console.log(chalk.cyan(`║         ISSA-XMD v1.0          ║`));
            console.log(chalk.cyan(`╚══════════════════════════════════╝`));
            console.log(chalk.magenta(`• Developer: Dave Tech`));
            console.log(chalk.magenta(`• Version: 1.0.0`));
            console.log(chalk.magenta(`• Status: Online ✅`));
            console.log(chalk.magenta(`• Time: ${new Date().toLocaleString()}`));

            await sendWelcomeMessage(XeonBotInc);
        } else if (connection === 'connecting') {
            log('🔄 Connecting ISSA-XMD to WhatsApp...', 'yellow');
        }
    });

    XeonBotInc.ev.on('creds.update', saveCreds);
    XeonBotInc.public = true;
    XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store);

    // Anticall handler
    const antiCallNotified = new Set();
    XeonBotInc.ev.on('call', async (calls) => {
        try {
            for (const call of calls) {
                const callerJid = call.from || call.peerJid || call.chatId;
                if (!callerJid) continue;

                if (!antiCallNotified.has(callerJid)) {
                    antiCallNotified.add(callerJid);
                    setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                    await XeonBotInc.sendMessage(callerJid, { 
                        text: '📵 ISSA: Calls are not allowed. You have been blocked.' 
                    });
                }
            }
        } catch (e) {}
    });

    return XeonBotInc;
}

// --- Main Flow ---
async function tylor() {
    // Load core modules
    try {
        require('./settings');
        const store = require('./lib/lightweight_store');
        store.readFromFile();
        log("✨ ISSAH core loaded", 'green');
    } catch (e) {
        log(`FATAL: Core load failed: ${e.message}`, 'red', true);
        process.exit(1);
    }

    await checkAndHandleSessionFormat();
    global.errorRetryCount = loadErrorCount().count;

    // Priority: Environment SESSION_ID with ISSA:~ prefix
    const envSessionID = process.env.SESSION_ID?.trim();
    if (envSessionID && envSessionID.startsWith('ARYAN:~')) {
        log(" [PRIORITY]: Using .env ARYAN session", 'magenta');
        clearSessionFiles();
        global.SESSION_ID = envSessionID;
        await downloadSessionData();
        await saveLoginMethod('session');
        await delay(3000);
        await startXeonBotInc();
        return;
    }

    log("[ALERT] No ISSA:~ session in .env, checking stored...", 'yellow');
    await checkSessionIntegrityAndClean();

    if (sessionExists()) {
        log("[ALERT]: Starting with stored session...", 'green');
        await delay(3000);
        await startXeonBotInc();
        return;
    }

    // Interactive login
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = (text) => new Promise(resolve => rl.question(text, resolve));

    console.log(chalk.cyan(`
    ╔══════════════════════════════╗
    ║     ARYAN-BOT Login          ║
    ╚══════════════════════════════╝`));

    log("Choose login method:", 'yellow');
    log("1) WhatsApp Number (Pairing Code)", 'blue');
    log("2) ISSA:~ Session ID", 'blue');

    let choice = await question("Choice (1/2): ");
    choice = choice.trim();

    if (choice === '1') {
        let phone = await question("Enter WhatsApp number (e.g., 254104260236): ");
        phone = phone.replace(/[^0-9]/g, '');
        global.phoneNumber = phone;
        await saveLoginMethod('number');
        const bot = await startXeonBotInc();
        await requestPairingCode(bot);
    } else if (choice === '2') {
        let sessionId = await question("Paste ISSA:~ Session ID: ");
        sessionId = sessionId.trim();
        if (!sessionId.includes("ISSA:~")) {
            log("Invalid! Must contain 'ISSA:~' prefix", 'red');
            process.exit(1);
        }
        global.SESSION_ID = sessionId;
        await saveLoginMethod('session');
        await downloadSessionData();
        await startXeonBotInc();
    } else {
        log("Invalid choice", 'red');
        process.exit(1);
    }
}

// --- Start Bot ---
tylor().catch(err => log(`Start error: ${err.message}`, 'red', true));
process.on('uncaughtException', (err) => log(`Uncaught: ${err.message}`, 'red', true));
process.on('unhandledRejection', (err) => log(`Unhandled: ${err.message}`, 'red', true));

// Auto-restart on file changes
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    log(chalk.redBright(`Updated ${__filename}`), 'yellow');
    delete require.cache[file];
    require(file);
});