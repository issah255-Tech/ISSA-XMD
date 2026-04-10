'use strict';

const axios = require('axios');
const { getBotName, createFakeContact, channelInfo } = require('../lib/messageConfig');

const WAIFUPICS_SFW = new Set([
  'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug',
  'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile',
  'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'happy', 'wink', 'poke',
  'dance', 'cringe', 'face-palm',
]);

const XWOLF_TYPES = new Set([
  'baka', 'bite', 'blush', 'bonk', 'cry', 'cuddle', 'dance', 'facepalm',
  'happy', 'highfive', 'hug', 'kiss', 'laugh', 'megumin', 'neko', 'nervous',
  'pat', 'poke', 'punch', 'shinobu', 'slap', 'sleep', 'smile', 'smug',
  'stare', 'thumbsup', 'waifu', 'wave', 'wink', 'yawn',
]);

const OTAKUGIFS_TYPES = new Set([
  'agree', 'baka', 'bite', 'blush', 'bored', 'cry', 'dance', 'facepalm',
  'happy', 'headbang', 'highfive', 'hug', 'kick', 'kiss', 'laugh', 'nom',
  'pat', 'peek', 'poke', 'pout', 'run', 'shrug', 'sip', 'slap', 'smile',
  'smug', 'wave', 'wink', 'yeet', 'yikes',
]);

const HMTAI_TYPES = new Set([
  'hug', 'kiss', 'slap', 'pat', 'cry', 'cuddle', 'blush', 'smile', 'wave',
  'bonk', 'poke', 'bite', 'lick', 'nom', 'dance', 'happy', 'wink', 'highfive',
  'baka', 'punch', 'stare', 'sleep', 'laugh', 'yeet', 'neko', 'waifu', 'smug',
]);

// Detect GIF from buffer magic bytes: GIF87a / GIF89a
function isGifBuf(buf) {
  return buf.length > 5 &&
    buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46;
}

async function fetchAnimeImg(category) {
  const norm = category.toLowerCase().trim();
  const waifuType  = norm === 'facepalm' ? 'face-palm' : norm;
  const xwolfType  = norm === 'face-palm' ? 'facepalm'  : norm;
  const otakuType  = norm === 'facepalm' ? 'facepalm'   : norm;
  const hmtaiType  = norm;

  const apis = [
    // 1. waifu.pics — returns GIF URLs directly
    async () => {
      if (!WAIFUPICS_SFW.has(waifuType)) throw new Error('not supported');
      const res = await axios.get(`https://api.waifu.pics/sfw/${waifuType}`, { timeout: 10000 });
      return res.data?.url || null;
    },
    // 2. otakugifs.xyz — high-quality GIFs, very reliable
    async () => {
      if (!OTAKUGIFS_TYPES.has(otakuType)) throw new Error('not supported');
      const res = await axios.get(`https://otakugifs.xyz/gif?reaction=${otakuType}`, { timeout: 10000 });
      return res.data?.url || null;
    },
    // 3. nekos.best — good quality GIFs
    async () => {
      const res = await axios.get(`https://nekos.best/api/v2/${norm}`, { timeout: 10000 });
      return res.data?.results?.[0]?.url || null;
    },
    // 4. hmtai — many reaction types
    async () => {
      if (!HMTAI_TYPES.has(hmtaiType)) throw new Error('not supported');
      const res = await axios.get(`https://hmtai.hatsunia.moe/v2/${hmtaiType}`, { timeout: 10000 });
      return res.data?.url || null;
    },
    // 5. xwolf — extra types (nervous, sleep, stare, thumbsup, yawn, punch)
    async () => {
      if (!XWOLF_TYPES.has(xwolfType)) throw new Error('not supported');
      const res = await axios.get(`https://apis.xwolf.space/api/anime/${xwolfType}`, { timeout: 10000 });
      return res.data?.result?.url || null;
    },
  ];

  for (const api of apis) {
    try {
      const url = await api();
      if (url) return url;
    } catch {}
  }
  return null;
}

async function downloadImg(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
  return Buffer.from(res.data);
}

function buildAnimeCommand(name, aliases, description, category) {
  return {
    name,
    aliases,
    category: 'anime',
    description,
    usage: `.${name}`,
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = createFakeContact(message);

      await sock.sendMessage(chatId, { react: { text: '🎌', key: message.key } });

      try {
        const imgUrl = await fetchAnimeImg(category);
        if (!imgUrl) throw new Error('No GIF found for this reaction');
        const buf = await downloadImg(imgUrl);

        // Detect GIF by magic bytes (reliable) — URL extension is a fallback
        const isGif = isGifBuf(buf) || imgUrl.toLowerCase().endsWith('.gif');

        if (isGif) {
          await sock.sendMessage(chatId, {
            video: buf,
            gifPlayback: true,
            mimetype: 'image/gif',
            caption: `🎌 *${botName}* | ${name.toUpperCase()}`,
            ...channelInfo,
          }, { quoted: fake });
        } else {
          await sock.sendMessage(chatId, {
            image: buf,
            caption: `🎌 *${botName}* | ${name.toUpperCase()}`,
            ...channelInfo,
          }, { quoted: fake });
        }
        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
      } catch (err) {
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, {
          text: `┏✧ *${botName}* \n┃ *Failed: ${err.message}*\n┗✧`,
        }, { quoted: fake });
      }
    }
  };
}

module.exports = [
  // ============================
  // ANIME MENU
  // ============================
  {
    name: 'animemenu',
    aliases: ['animes', 'animelist'],
    category: 'anime',
    description: 'Show all anime commands',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = createFakeContact(message);
      const prefix = global.prefix || '.';

      const cats = ALL_CATEGORIES.map(c => `• *${prefix}${c}*`).join('\n');
      await sock.sendMessage(chatId, {
        text: `┏✧\n🎌 *ANIME COMMANDS*\n┗✧\n\n${cats}\n\n> Powered by Adevos-X Tech`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // WAIFU
  // ============================
  buildAnimeCommand('waifu', ['wife', 'waifupic'], 'Random waifu image', 'waifu'),
  buildAnimeCommand('neko', ['catgirl', 'nekogirl'], 'Random neko/catgirl image', 'neko'),
  buildAnimeCommand('kitsune', ['foxgirl'], 'Random kitsune/fox girl', 'kitsune'),
  buildAnimeCommand('husbando', ['husband'], 'Random husbando image', 'husbando'),
  buildAnimeCommand('shinobu', [], 'Shinobu from Demon Slayer', 'shinobu'),
  buildAnimeCommand('megumin', [], 'Megumin from KonoSuba', 'megumin'),

  // ============================
  // ANIME GIF REACTIONS
  // ============================
  buildAnimeCommand('hug', ['abraco'], 'Send an anime hug GIF', 'hug'),
  buildAnimeCommand('kiss', ['beso'], 'Send an anime kiss GIF', 'kiss'),
  buildAnimeCommand('slap', ['bofetada'], 'Slap someone anime style', 'slap'),
  buildAnimeCommand('pat', ['patpat', 'headpat'], 'Pat someone on the head', 'pat'),
  buildAnimeCommand('cry', ['llora', 'crying'], 'Anime crying GIF', 'cry'),
  buildAnimeCommand('cuddle', ['snuggle'], 'Anime cuddle GIF', 'cuddle'),
  buildAnimeCommand('blush', ['rubor'], 'Anime blushing GIF', 'blush'),
  buildAnimeCommand('smile', ['sonrisa'], 'Anime smile GIF', 'smile'),
  buildAnimeCommand('wave', ['ola', 'hello'], 'Anime wave GIF', 'wave'),
  buildAnimeCommand('bonk', ['bop'], 'Bonk anime style', 'bonk'),
  buildAnimeCommand('yeet', [], 'Yeet anime style', 'yeet'),
  buildAnimeCommand('poke', ['pegar'], 'Poke someone anime style', 'poke'),
  buildAnimeCommand('bully', ['bully'], 'Anime bully GIF', 'bully'),
  buildAnimeCommand('bite', ['morder'], 'Anime bite GIF', 'bite'),
  buildAnimeCommand('lick', ['lamer'], 'Anime lick GIF', 'lick'),
  buildAnimeCommand('nom', ['chomp'], 'Nom nom anime style', 'nom'),
  buildAnimeCommand('glomp', ['tackle'], 'Anime glomp GIF', 'glomp'),
  buildAnimeCommand('dance', ['bailar'], 'Anime dance GIF', 'dance'),
  buildAnimeCommand('happy', ['feliz'], 'Anime happy GIF', 'happy'),
  buildAnimeCommand('wink', ['guinar'], 'Anime wink GIF', 'wink'),
  buildAnimeCommand('highfive', ['choca'], 'Anime high five GIF', 'highfive'),
  buildAnimeCommand('handhold', ['tomar'], 'Anime hand holding GIF', 'handhold'),
  buildAnimeCommand('awoo', ['howl'], 'Anime awoo GIF', 'awoo'),
  buildAnimeCommand('smug', [], 'Anime smug face', 'smug'),
  buildAnimeCommand('cringe', [], 'Anime cringe GIF', 'cringe'),
  buildAnimeCommand('kick', ['patada'], 'Anime kick GIF', 'kick'),

  // ============================
  // EXTRA ANIME TYPES (xwolf)
  // ============================
  buildAnimeCommand('baka', ['idiot', 'bakabaka'], 'Anime baka GIF', 'baka'),
  buildAnimeCommand('laugh', ['lol', 'haha'], 'Anime laugh GIF', 'laugh'),
  buildAnimeCommand('nervous', ['shy', 'anxious'], 'Anime nervous GIF', 'nervous'),
  buildAnimeCommand('punch', ['hit', 'fist'], 'Anime punch GIF', 'punch'),
  buildAnimeCommand('sleep', ['sleepy', 'nap'], 'Anime sleep GIF', 'sleep'),
  buildAnimeCommand('stare', ['glare', 'gaze'], 'Anime stare GIF', 'stare'),
  buildAnimeCommand('thumbsup', ['thumbup', 'goodjob'], 'Anime thumbs up GIF', 'thumbsup'),
  buildAnimeCommand('yawn', ['tired', 'bored'], 'Anime yawn GIF', 'yawn'),
  buildAnimeCommand('facepalm', ['fp', 'facepalm2'], 'Anime facepalm GIF', 'facepalm'),
];
