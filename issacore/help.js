// ──────────────────────────────────────────────────────────────
//  MR issa – SIMPLE MENU 
// ──────────────────────────────────────────────────────────────
const settings = require('../settings');
const axios = require('axios');
const { prepareWAMessageMedia } = require('@whiskeysockets/baileys');

const IMAGES = [
  'https://n.uguu.se/eTdgKKvB.jpg',
];

/**
 * Read More Spoiler (WhatsApp Hack)
 */
const READ_MORE = '\u200B'.repeat(4001);

/**
 * Dynamic Uptime
 */
function getUptime() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Full Help Message with DAVE-X style frame
 */
const HELP_MESSAGE = `
╭━━━〔𝐈𝐒𝐒𝐀-𝐗𝐌𝐃〕━━⬣
┃ 🔥 𝘾𝙧𝙚𝙖𝙩𝙤𝙧 : \`『𝙎𝙄𝙍 𝙄𝙎𝙎𝘼』\`
┃ 🧨 𝙊𝙬𝙣𝙚𝙧   : ${settings.botOwner || '𝙄𝙎𝙎𝘼'}
┃ 💣 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : ${settings.version || '2.0.0'}
┃ ⏱️ 𝙍𝙪𝙣𝙩𝙞𝙢𝙚 : ${getUptime()}
┃ 🧩 𝙋𝙡𝙪𝙜𝙞𝙣𝙨 : \`420\`
┃ 💊 𝙍𝘼𝙈     : 𝚀𝚞𝚊𝚗𝚝𝚞𝚖 𝚇𝟽
╰━━━━━━━━━━━━━━━━━━⬣

┏━━「 \`General\` 」
│ ─≽ *help | .menu*
│ ─≽ *ping*
│ ─≽ *alive*
│ ─≽ *tts <text>*
│ ─≽ *owner*
│ ─≽ *joke*
│ ─≽ *quote*
│ ─≽ *fact*
│ ─≽ *weather <city>*
│ ─≽ *news*
│ ─≽ *attpp <text>*
│ ─≽ *lyrics <song>*
│ ─≽ *8ball <question>*
│ ─≽ *groupinfo*
│ ─≽ *staff | .admins*
│ ─≽ *vv*
│ ─≽ *trt <text> <lang>*
│ ─≽ *ss <link>*
│ ─≽ *jid*
│ ─≽ *url*
┗━━━━━━━━━━━━━━━♢

┏━━「 \`Group\` 」
│ ─≽ *ban @user*
│ ─≽ *promote @user*
│ ─≽ *demote @user*
│ ─≽ *mute <minutes>*
│ ─≽ *unmute*
│ ─≽ *delete | .del*
│ ─≽ *kick @user*
│ ─≽ *warnings @user*
│ ─≽ *warn @user*
│ ─≽ *antilink*
│ ─≽ *antibadword*
│ ─≽ *clear*
│ ─≽ *tag <message>*
│ ─≽ *tagall*
│ ─≽ *tagnotadmin*
│ ─≽ *hidetag <message>*
│ ─≽ *chatbot*
│ ─≽ *resetlink*
│ ─≽ *antitag <on/off>*
│ ─≽ *welcome <on/off>*
│ ─≽ *goodbye <on/off>*
│ ─≽ *setgdesc <description>*
│ ─≽ *setgname <new name>*
│ ─≽ *setgpp*
┗━━━━━━━━━━━━━━━♢

┏━━「 \`Settings\` 」
│ ─≽ *mode <public/private>*
│ ─≽ *clearsession*
│ ─≽ *antidelete*
│ ─≽ *cleartmp*
│ ─≽ *update*
│ ─≽ *settings*
│ ─≽ *setpp*
│ ─≽ *autoreact <on/off>*
│ ─≽ *autostatus <on/off>*
│ ─≽ *autostatus react <on/off>*
│ ─≽ *autotyping <on/off>*
│ ─≽ *autoread <on/off>*
│ ─≽ *anticall <on/off>*
│ ─≽ *pmblocker <on/off/status>*
│ ─≽ *pmblocker setmsg <text>*
│ ─≽ *setmention*
│ ─≽ *mention <on/off>*
┗━━━━━━━━━━━━━━━♢

┏━━「 \`Media\` 」
│ ─≽ *blur <image>*
│ ─≽ *simage*
│ ─≽ *sticker*
│ ─≽ *removebg*
│ ─≽ *remini*
│ ─≽ *crop*
│ ─≽ *tgsticker <link>*
│ ─≽ *meme*
│ ─≽ *take <packname>*
│ ─≽ *emojimix <emj1>+<emj2>*
│ ─≽ *igs <insta link>*
│ ─≽ *igsc <insta link>*
┗━━━━━━━━━━━━━━━♢

┏━━「 \`AI & Download\` 」
│ ─≽ *gpt <question>*
│ ─≽ *gemini <question>*
│ ─≽ *imagine <prompt>*
│ ─≽ *flux <prompt>*
│ ─≽ *sora <prompt>*
│ ─≽ *play <song>*
│ ─≽ *song <song>*
│ ─≽ *spotify <query>*
│ ─≽ *instagram <link>*
│ ─≽ *facebook <link>*
│ ─≽ *tiktok <link>*
│ ─≽ *video <song>*
│ ─≽ *ytmp4 <link>*
┗━━━━━━━━━━━━━━━♢

┏━━「 \`Fun & Games\` 」
│ ─≽ *pies <country>*
│ ─≽ *china*
│ ─≽ *indonesia*
│ ─≽ *japan*
│ ─≽ *korea*
│ ─≽ *hijab*
│ ─≽ *tictactoe @user*
│ ─≽ *hangman*
│ ─≽ *guess <letter>*
│ ─≽ *trivia*
│ ─≽ *answer <answer>*
│ ─≽ *truth*
│ ─≽ *dare*
┗━━━━━━━━━━━━━━━♢

━━「 \`Effects\` 」
│ ─≽ *heart*
│ ─≽ *horny*
│ ─≽ *circle*
│ ─≽ *lgbt*
│ ─≽ *lolice*
│ ─≽ *its-so-stupid*
│ ─≽ *namecard*
│ ─≽ *oogway*
│ ─≽ *tweet*
│ ─≽ *ytcomment*
│ ─≽ *comrade*
│ ─≽ *gay*
│ ─≽ *glass*
│ ─≽ *jail*
│ ─≽ *passed*
│ ─≽ *triggered*
│──────♢
┗━━⬣ ⌜ \`Powered by ISSA\`⌟

> 🔚 𝐌𝐮𝐜𝐡 𝐋𝐨𝐯𝐞, 𝙄𝙎𝙎𝘼-𝙓𝙈𝘿
`;

/**
 * Pick Random Item from Array
 */
const pickRandom = (arr) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

/**
 * Validate URL via HEAD request
 */
const isValidUrl = async (url) => {
  try {
    const { status } = await axios.head(url, { timeout: 6000 });
    return status >= 200 && status < 400;
  } catch {
    return false;
  }
};

/**
 * Simple Image + Text Menu
 */
const helpCommand = async (sock, chatId, message) => {
  if (!sock || !chatId) return console.error('Missing sock or chatId');

  try {
    // Try to send with image
    const imageUrl = IMAGES[0]; // Use first image

    try {
      const media = await prepareWAMessageMedia(
        { image: { url: imageUrl } },
        { upload: sock.waUploadToServer }
      );

      await sock.sendMessage(chatId, {
        ...media,
        caption: HELP_MESSAGE
      }, { quoted: message });

    } catch (imageError) {
      // If image fails, send text only
      console.warn('Image upload failed, sending text only:', imageError.message);
      await sock.sendMessage(chatId, { 
        text: HELP_MESSAGE 
      }, { quoted: message });
    }

  } catch (error) {
    console.error('Help Command Error:', error);
    await sock.sendMessage(chatId, { 
      text: HELP_MESSAGE 
    }, { quoted: message });
  }
};

module.exports = helpCommand;