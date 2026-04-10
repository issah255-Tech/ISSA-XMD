'use strict';

const axios = require('axios');
const { getBotName, createFakeContact, channelInfo } = require('../lib/messageConfig');

function _fake(senderId) { return createFakeContact(senderId); }
function _rnd(n) { return Math.floor(Math.random() * n); }
function _pct() { return Math.floor(Math.random() * 101); }

module.exports = [

  // ============================
  // MAGIC 8 BALL
  // ============================
  {
    name: '8ball',
    aliases: ['eightball', 'ask8'],
    category: 'fun',
    description: 'Ask the magic 8 ball',
    usage: '.8ball Will I win today?',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const q = args.join(' ').trim();
      if (!q) return sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ *Ask a question: .8ball Will I win?*\n┗✧` }, { quoted: fake });
      const answers = [
        '🟢 It is certain!','🟢 Without a doubt!','🟢 Yes definitely!','🟢 You may rely on it.','🟢 As I see it, yes.',
        '🟡 Reply hazy, try again.','🟡 Ask again later.','🟡 Better not tell you now.','🟡 Cannot predict now.',
        '🔴 Don\'t count on it.','🔴 My reply is no.','🔴 My sources say no.','🔴 Outlook not so good.','🔴 Very doubtful.'
      ];
      const ans = answers[_rnd(answers.length)];
      await sock.sendMessage(chatId, {
        text: `┏✧🎱 *${botName} 8BALL* \n┃ *Question:* ${q}\n┃ *Answer:* ${ans}\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // TRUTH OR DARE
  // ============================
  {
    name: 'truth',
    aliases: ['truthquestion'],
    category: 'fun',
    description: 'Get a random truth question',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const truths = [
        'What is your biggest fear?','Have you ever lied to your best friend?','What is the most embarrassing thing you have done?',
        'Who was your first crush?','Have you ever cheated on a test?','What is your biggest regret?','Who do you talk about most to others?',
        'Have you ever stolen something?','What is your worst habit?','Have you ever stood someone up?',
        'What is something you have never told anyone?','What is the most childish thing you still do?',
        'Who in this group do you find most attractive?','Have you ever ghosted someone?','What is your biggest insecurity?'
      ];
      await sock.sendMessage(chatId, {
        text: `┏✧💬 *${botName} TRUTH* \n┃ ${truths[_rnd(truths.length)]}\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },
  {
    name: 'dare',
    aliases: ['darechallenge'],
    category: 'fun',
    description: 'Get a random dare challenge',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const dares = [
        'Send a selfie right now!','Sing a song of someone\'s choice.','Do 20 push-ups.','Change your status to something embarrassing for 10 minutes.',
        'Text your crush right now.','Post an embarrassing childhood photo.','Call a random contact and sing Happy Birthday.',
        'Let someone else send a message from your phone.','Do your best impression of another group member.',
        'Write a love poem in the next 5 minutes.','Speak in an accent for the next 10 minutes.',
        'Share your most recent search history.','Let others go through your camera roll for 30 seconds.',
        'Do the worm dance right now.','Reveal the last person you googled.'
      ];
      await sock.sendMessage(chatId, {
        text: `┏✧🔥 *${botName} DARE* \n┃ ${dares[_rnd(dares.length)]}\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // RANDOM QUOTE
  // ============================
  {
    name: 'quote',
    aliases: ['randomquote', 'inspire'],
    category: 'fun',
    description: 'Get a random inspirational quote',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      try {
        const res = await axios.get('https://api.quotable.io/random', { timeout: 8000 });
        const { content, author } = res.data;
        await sock.sendMessage(chatId, {
          text: `┏✧💭 *${botName} QUOTE*\n┃ "${content}"\n┃ — *${author}\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      } catch {
        const quotes = [
          { q: 'The only way to do great work is to love what you do.', a: 'Steve Jobs' },
          { q: 'In the middle of every difficulty lies opportunity.', a: 'Albert Einstein' },
          { q: 'It always seems impossible until it\'s done.', a: 'Nelson Mandela' },
          { q: 'The future belongs to those who believe in the beauty of their dreams.', a: 'Eleanor Roosevelt' },
        ];
        const { q, a } = quotes[_rnd(quotes.length)];
        await sock.sendMessage(chatId, {
          text: `┏✧💭 *${botName} QUOTE* \n┃ "${q}"\n┃ — *${a}*\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      }
    }
  },

  // ============================
  // JOKE
  // ============================
  {
    name: 'joke',
    aliases: ['jokes', 'telljoke'],
    category: 'fun',
    description: 'Get a random joke',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      try {
        const res = await axios.get('https://official-joke-api.appspot.com/random_joke', { timeout: 8000 });
        const { setup, punchline } = res.data;
        await sock.sendMessage(chatId, {
          text: `┏✧😂 *${botName} JOKE*\n┃ ${setup}\n┃ ...${punchline}\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      } catch {
        const jokes = [
          { s: 'Why don\'t scientists trust atoms?', p: 'Because they make up everything!' },
          { s: 'What do you call a fake noodle?', p: 'An Impasta!' },
          { s: 'Why couldn\'t the bicycle stand up by itself?', p: 'It was two-tired!' },
        ];
        const { s, p } = jokes[_rnd(jokes.length)];
        await sock.sendMessage(chatId, {
          text: `┏✧😂 *${botName} JOKE*\n┃ ${s}\n┃ ...${p}\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      }
    }
  },

  // ============================
  // ROAST
  // ============================
  {
    name: 'roast',
    aliases: ['roastme'],
    category: 'fun',
    description: 'Roast someone (all in fun)',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0];
      const name = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'you');
      const roasts = [
        `${name}, you are the human version of a participation trophy.`,
        `${name}, if laughter is the best medicine, your face must be curing diseases.`,
        `${name}, I'd call you a tool, but even tools are useful.`,
        `${name}, you are not stupid; you just have bad luck thinking.`,
        `${name}, I'd agree with you but then we'd both be wrong.`,
        `${name}, somewhere out there is a tree tirelessly producing oxygen for you. You owe it an apology.`,
        `${name}, you are the reason shampoo has instructions.`,
        `${name}, talking to you is like reading the terms and conditions — eventually you just give up.`,
        `${name}, your secrets are always safe with me. I never even listen when you tell me them.`,
        `${name}, I could eat a bowl of alphabet soup and spit out a smarter argument than yours.`,
      ];
      await sock.sendMessage(chatId, {
        text: `┏✧ *${botName} ROAST* \n┃ ${roasts[_rnd(roasts.length)]}\n┗✧`,
        mentions: target ? [target] : [],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // COMPLIMENT
  // ============================
  {
    name: 'compliment',
    aliases: ['flatter', 'praise'],
    category: 'fun',
    description: 'Compliment someone',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0];
      const name = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'you');
      const compliments = [
        `${name}, you make the world a better place just by being in it. 🌟`,
        `${name}, your smile could cure a thousand bad days. 😊`,
        `${name}, you are one of the most genuine people anyone will ever meet. 💯`,
        `${name}, the way you carry yourself is truly inspiring. 👑`,
        `${name}, your kindness is something this world needs more of. 💖`,
        `${name}, you have a gift for making people feel heard and valued. 🙌`,
        `${name}, you are stronger than you believe. 💪`,
        `${name}, your creativity lights up every room you walk into. ✨`,
        `${name}, you are someone worth knowing. 🤝`,
        `${name}, you make every moment more meaningful just by being present. 🌈`,
      ];
      await sock.sendMessage(chatId, {
        text: `┏✧💝 *${botName} COMPLIMENT*\n┃ ${compliments[_rnd(compliments.length)]}\n┗✧`,
        mentions: target ? [target] : [],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // MOTIVATION
  // ============================
  {
    name: 'motivation',
    aliases: ['motivate', 'inspire2'],
    category: 'fun',
    description: 'Get a motivational message',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const msgs = [
        'Every day is a second chance. Make today count! 💪',
        'Your only limit is you. Push through! 🚀',
        'Small steps every day lead to big changes over time. 🌱',
        'You are capable of amazing things. Believe in yourself! ⭐',
        'The journey of a thousand miles begins with a single step. Take yours today! 👟',
        'Failure is not the opposite of success; it is a part of it. Keep going! 🔥',
        'You did not come this far to only come this far. Keep pushing! 💫',
        'Dream big. Work hard. Stay focused. The results will speak for themselves. 🎯',
        'Every expert was once a beginner. Start now! 📚',
        'Your future self is counting on what you do today. Make it count! 🌟',
      ];
      await sock.sendMessage(chatId, {
        text: `┏✧💪 *${botName} MOTIVATION* \n┃ ${msgs[_rnd(msgs.length)]}\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // RANDOM FACT
  // ============================
  {
    name: 'fact',
    aliases: ['randomfact', 'funfact'],
    category: 'fun',
    description: 'Get a random fun fact',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      try {
        const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en', { timeout: 8000 });
        const fact = res.data.text;
        await sock.sendMessage(chatId, {
          text: `┏✧🧠 *${botName} FACT* 』\n┃ ${fact}\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      } catch {
        const facts = [
          'Honey never spoils. Archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible.',
          'A group of flamingos is called a flamboyance.',
          'The shortest war in history was between Britain and Zanzibar in 1896 — it lasted just 38 minutes.',
          'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.',
          'Bananas are berries, but strawberries are not.',
          'Octopuses have three hearts, blue blood, and nine brains.',
          'The average person walks about 100,000 miles in their lifetime.',
        ];
        await sock.sendMessage(chatId, {
          text: `┏✧ *${botName} FACT* \n┃ ${facts[_rnd(facts.length)]}\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      }
    }
  },

  // ============================
  // RIDDLE
  // ============================
  {
    name: 'riddle',
    aliases: ['puzzleme', 'brainteaser'],
    category: 'fun',
    description: 'Get a random riddle',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const riddles = [
        { q: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', a: 'An echo' },
        { q: 'The more you take, the more you leave behind. What am I?', a: 'Footsteps' },
        { q: 'I have cities but no houses, mountains but no trees, and water but no fish. What am I?', a: 'A map' },
        { q: 'What has hands but can\'t clap?', a: 'A clock' },
        { q: 'I get wetter the more I dry. What am I?', a: 'A towel' },
        { q: 'What can you catch but not throw?', a: 'A cold' },
        { q: 'What has a head, a tail, is brown, and has no legs?', a: 'A penny' },
        { q: 'What comes once in a minute, twice in a moment, but never in a thousand years?', a: 'The letter M' },
      ];
      const { q, a } = riddles[_rnd(riddles.length)];
      await sock.sendMessage(chatId, {
        text: `┏✧🤔 *${botName} RIDDLE* 』\n┃ *Riddle:* ${q}\n┃ *Reply .answer to reveal!*\n┃ *Answer:* ||${a}||\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // SHIP
  // ============================
  {
    name: 'ship',
    aliases: ['love', 'lovematch'],
    category: 'fun',
    description: 'Ship two people together',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      let p1, p2;
      if (mentions.length >= 2) { p1 = `@${mentions[0].split('@')[0]}`; p2 = `@${mentions[1].split('@')[0]}`; }
      else if (args.length >= 2) { p1 = args[0]; p2 = args.slice(1).join(' '); }
      else return sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ Mention two people: .ship @user1 @user2\n┗✧` }, { quoted: fake });
      const pct = _pct();
      const bar = '❤️'.repeat(Math.round(pct / 10)) + '🖤'.repeat(10 - Math.round(pct / 10));
      const emoji = pct >= 80 ? '💞' : pct >= 60 ? '💕' : pct >= 40 ? '💛' : pct >= 20 ? '💔' : '😬';
      await sock.sendMessage(chatId, {
        text: `┏✧💘 *${botName} SHIP* \n┃ ${p1} ❤️ ${p2}\n┃ ${bar}\n┃ *Love Meter:* ${pct}% ${emoji}\n┗✧`,
        mentions: mentions.length >= 2 ? [mentions[0], mentions[1]] : [],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // SIMP RATING
  // ============================
  {
    name: 'simp',
    aliases: ['simprate', 'simpcheck'],
    category: 'fun',
    description: 'Rate someone\'s simp level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const lvl = pct >= 90 ? 'God-tier Simp 😭' : pct >= 70 ? 'Certified Simp 🥺' : pct >= 50 ? 'Part-time Simp 😅' : pct >= 30 ? 'Slightly Simping 😐' : 'Not a Simp ✅';
      const bar = '💗'.repeat(Math.round(pct / 10)) + '⬜'.repeat(10 - Math.round(pct / 10));
      await sock.sendMessage(chatId, {
        text: `┏✧💞 *${botName} SIMP* \n┃ *User:* ${name}\n┃ ${bar} ${pct}%\n┃ *Level:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // IQ RATING
  // ============================
  {
    name: 'iq',
    aliases: ['iqtest', 'intelligence'],
    category: 'fun',
    description: 'Check someone\'s "IQ"',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const iq = Math.floor(Math.random() * 160) + 40;
      const lvl = iq >= 140 ? 'Genius 🧠' : iq >= 120 ? 'Very Smart 🌟' : iq >= 100 ? 'Above Average ✅' : iq >= 80 ? 'Average 😐' : 'Needs Improvement 😅';
      await sock.sendMessage(chatId, {
        text: `┏✧🧠 *${botName} IQ TEST* \n┃ *User:* ${name}\n┃ *IQ Score:* ${iq}\n┃ *Level:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // HOT RATE
  // ============================
  {
    name: 'hotrate',
    aliases: ['hotcheck', 'attractiveness'],
    category: 'fun',
    description: 'Rate someone\'s attractiveness',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const emoji = pct >= 90 ? '🔥🔥🔥' : pct >= 70 ? '😍😍' : pct >= 50 ? '😊👌' : pct >= 30 ? '😐' : '💀';
      const bar = '🔥'.repeat(Math.round(pct / 10)) + '⬜'.repeat(10 - Math.round(pct / 10));
      await sock.sendMessage(chatId, {
        text: `┏✧ *${botName} HOT RATE* \n *User:* ${name}\n┃ ${bar} ${pct}%\n┃ *Rating:* ${emoji}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // WASTED
  // ============================
  {
    name: 'wasted',
    aliases: ['rip', 'gg'],
    category: 'fun',
    description: 'GTA wasted screen for a user',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const cause = args.filter(a => !a.startsWith('@')).join(' ') || 'unknown causes';
      await sock.sendMessage(chatId, {
        text: `┏✧☠️ *${botName}* \n┃ ██████████████████████\n┃ ██   W A S T E D   ██\n┃ ██████████████████████\n┃\n┃ *${name}* has been wasted!\n┃ *Cause:* ${cause}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // WANTED
  // ============================
  {
    name: 'wanted',
    aliases: ['wantedposter'],
    category: 'fun',
    description: 'Make someone a wanted criminal',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const bounty = (Math.floor(Math.random() * 9900) + 100) * 1000;
      const crimes = ['Excessive spamming','Being too handsome','Knowing too many memes','Roasting people daily','Making bad puns','Breaking the group rules','Excessive ghosting','Sending too many voice notes'];
      const crime = crimes[_rnd(crimes.length)];
      await sock.sendMessage(chatId, {
        text: `┏✧🚨 *${botName} WANTED* \n┃ ┌──────────────────┐\n│ │   W A N T E D    │\n│ │  Dead or Alive   │\n│ └──────────────────┘\n┃\n┃ *Name:* ${name}\n┃ *Crime:* ${crime}\n┃ *Bounty:* $${bounty.toLocaleString()}\n┃\n┃ Report to local authorities!\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // ACTION MESSAGES
  // ============================
  {
    name: 'slap',
    aliases: ['hit'],
    category: 'fun',
    description: 'Slap someone',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0];
      const sender = `@${senderId.split('@')[0]}`;
      const victim = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'the air');
      const actions = [`${sender} slaps ${victim} with a giant fish! 🐟`, `${sender} gives ${victim} a mighty slap! 👋`, `${sender} SLAPS ${victim} across the face! 😤`];
      await sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ ${actions[_rnd(actions.length)]}\n┗✧`, mentions: [senderId, ...(target ? [target] : [])], ...channelInfo }, { quoted: fake });
    }
  },
  {
    name: 'hug',
    aliases: ['cuddle'],
    category: 'fun',
    description: 'Hug someone',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0];
      const sender = `@${senderId.split('@')[0]}`;
      const victim = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'everyone');
      await sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ ${sender} gives ${victim} a big warm hug! 🤗❤️\n┗✧`, mentions: [senderId, ...(target ? [target] : [])], ...channelInfo }, { quoted: fake });
    }
  },
  {
    name: 'pat',
    aliases: ['headpat'],
    category: 'fun',
    description: 'Pat someone on the head',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0];
      const sender = `@${senderId.split('@')[0]}`;
      const victim = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'you');
      await sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ ${sender} pats \n┃ ${victim} on the head. There, there. 🥹\n┗✧`, mentions: [senderId, ...(target ? [target] : [])], ...channelInfo }, { quoted: fake });
    }
  },
  {
    name: 'kiss',
    aliases: ['smooch'],
    category: 'fun',
    description: 'Kiss someone',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0];
      const sender = `@${senderId.split('@')[0]}`;
      const victim = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'you');
      await sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ ${sender} kisses ${victim}! 💋😳\n┗✧`, mentions: [senderId, ...(target ? [target] : [])], ...channelInfo }, { quoted: fake });
    }
  },
  {
    name: 'bonk',
    aliases: ['bonkhead'],
    category: 'fun',
    description: 'Bonk someone to horny jail',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0];
      const sender = `@${senderId.split('@')[0]}`;
      const victim = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'you');
      await sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ ${sender} *BONK!* 🔨 ${victim} — Go to horny jail! ⛓️🚔\n┗✧`, mentions: [senderId, ...(target ? [target] : [])], ...channelInfo }, { quoted: fake });
    }
  },
  {
    name: 'punch',
    aliases: ['uppercut'],
    category: 'fun',
    description: 'Punch someone',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0];
      const sender = `@${senderId.split('@')[0]}`;
      const victim = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'the wall');
      await sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ ${sender} throws a mean punch at ${victim}! 🥊💥 Pow!\n┗✧`, mentions: [senderId, ...(target ? [target] : [])], ...channelInfo }, { quoted: fake });
    }
  },

  // ============================
  // TEXT TRANSFORMS
  // ============================
  {
    name: 'uwuify',
    aliases: ['uwu'],
    category: 'fun',
    description: 'UwUify text',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const text = args.join(' ') || 'Hello World';
      const uwu = text.replace(/[rl]/g, 'w').replace(/[RL]/g, 'W').replace(/n([aeiou])/g, 'ny$1').replace(/N([aeiou])/g, 'Ny$1').replace(/\b(the|The)\b/g, 'da').replace(/ove/g, 'uv').replace(/!+/g, '! uwu').replace(/\?+/g, '? owo');
      await sock.sendMessage(chatId, { text: `${uwu} OwO`, ...channelInfo }, { quoted: fake });
    }
  },
  {
    name: 'owoify',
    aliases: ['owo'],
    category: 'fun',
    description: 'OwoOify text',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const text = args.join(' ') || 'Hello World';
      const owo = text.replace(/[rl]/g, 'w').replace(/[RL]/g, 'W').replace(/\b\w/g, c => c + 'w').replace(/\.\s/g, '! owo ').replace(/!\s/g, '! rawr ');
      await sock.sendMessage(chatId, { text: `${owo} >w<`, ...channelInfo }, { quoted: fake });
    }
  },
  {
    name: 'spongebobify',
    aliases: ['spongebob', 'mocking'],
    category: 'fun',
    description: 'Convert to SpOnGeBoB mocking text',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const text = args.join(' ');
      if (!text) return sock.sendMessage(chatId, { text: `┏✧ *${botName}* \n┃ Provide text.\n┗✧` }, { quoted: fake });
      let result = '', upper = false;
      for (const c of text) { result += upper ? c.toUpperCase() : c.toLowerCase(); if (c !== ' ') upper = !upper; }
      await sock.sendMessage(chatId, { text: result, ...channelInfo }, { quoted: fake });
    }
  },

  // ============================
  // PP SIZE (fun)
  // ============================
  {
    name: 'pp',
    aliases: ['ppsize', 'ppcheck'],
    category: 'fun',
    description: 'Check someone\'s "pp" size (fun only)',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const size = Math.floor(Math.random() * 20);
      const bar = '8' + '='.repeat(size) + 'D';
      await sock.sendMessage(chatId, {
        text: `┏✧ *${botName} PP SIZE* \n┃ *User:* ${name}\n┃ *Size:* ${size} cm\n┃ ${bar}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // RIZZ RATING
  // ============================
  {
    name: 'rizz',
    aliases: ['rizzcheck', 'charisma'],
    category: 'fun',
    description: 'Check someone\'s rizz level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const lvl = pct >= 90 ? 'W Rizz 👑' : pct >= 70 ? 'Strong Rizz 💪' : pct >= 50 ? 'Mid Rizz 😐' : pct >= 30 ? 'Low Rizz 😅' : 'No Rizz 💀';
      const bar = '✨'.repeat(Math.round(pct / 10)) + '⬜'.repeat(10 - Math.round(pct / 10));
      await sock.sendMessage(chatId, {
        text: `┏✧💫 *${botName} RIZZ* \n┃ *User:* ${name}\n┃ ${bar} ${pct}%\n┃ *Level:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // SUS RATING
  // ============================
  {
    name: 'sus',
    aliases: ['amogus', 'impostor'],
    category: 'fun',
    description: 'Check someone\'s sus level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const lvl = pct >= 90 ? '🔴 IMPOSTOR! EJECT THEM!' : pct >= 70 ? '🟠 Very sus...' : pct >= 50 ? '🟡 Kinda sus' : pct >= 30 ? '🟢 Probably crewmate' : '🔵 100% Crewmate';
      await sock.sendMessage(chatId, {
        text: `┏✧📯 *${botName} SUS METER* \n┃ *User:* ${name}\n┃ *Sus Level:* ${pct}%\n┃ *Verdict:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // GAY RATE
  // ============================
  {
    name: 'gayrate',
    aliases: ['gaymeter', 'gay'],
    category: 'fun',
    description: 'Check gay rate (all in fun)',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const bar = '🏳️‍🌈'.repeat(Math.round(pct / 10)) + '⬜'.repeat(10 - Math.round(pct / 10));
      await sock.sendMessage(chatId, {
        text: `┏✧🌈 *${botName} GAY METER* \n┃ *User:* ${name}\n┃ ${bar} ${pct}%\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

// ============================
  // CLOWN RATE
  // ============================
  {
    name: 'clown',
    aliases: ['clownrate', 'clownmeter'],
    category: 'fun',
    description: 'Check clown level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const bar = '🤡'.repeat(Math.round(pct / 10)) + '⬜'.repeat(10 - Math.round(pct / 10));
      const msg = pct >= 90 ? 'CERTIFIED CLOWN 🎪' : pct >= 60 ? 'Part-time Clown 🤡' : 'Not that clownish 😊';
      await sock.sendMessage(chatId, {
        text: `🎪 ┏✧ *${botName} CLOWN METER* ✧\n┃ *User:* ${name}\n┃ ${bar} ${pct}%\n┃ ${msg}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },


// ============================
  // WOULD YOU RATHER
  // ============================
  {
    name: 'wyr',
    aliases: ['wouldyourather', 'rather'],
    category: 'fun',
    description: 'Would you rather question',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const wyrs = [
        ['Have the ability to fly','Have the ability to be invisible'],
        ['Always be 10 minutes late','Always be 20 minutes early'],
        ['Have no internet for a month','Have no phone for a month'],
        ['Know the date of your death','Know the cause of your death'],
        ['Live without music','Live without television'],
        ['Never use social media again','Never watch another movie or TV show again'],
        ['Be able to speak all languages','Be able to play all instruments'],
        ['Have unlimited money but no friends','Have unlimited friends but no money'],
        ['Always have to sing instead of speak','Always have to dance instead of walk'],
        ['Find your true love','Find a suitcase with $10 million'],
      ];
      const [a, b] = wyrs[_rnd(wyrs.length)];
      await sock.sendMessage(chatId, {
        text: `┏✧ *${botName} WOULD YOU RATHER*\n┃\n┃ 🅰️ ${a}\n┃\n┃ 🆚\n┃\n┃ 🅱️ ${b}\n┃\n┃ Vote with 🅰️ or 🅱️!\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

// ============================
  // NEVER HAVE I EVER
  // ============================
  {
    name: 'neverhaveiever',
    aliases: ['nhie'],
    category: 'fun',
    description: 'Never have I ever statement',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const items = [
        'Gone skinny dipping','Lied about my age','Stayed up all night','Eaten food off the floor','Pretended to be sick to skip work/school',
        'Crashed a party','Texted the wrong person something embarrassing','Binge-watched an entire show in one day',
        'Laughed so hard I cried','Stalked someone\'s profile for an hour','Forgotten someone\'s name right after meeting them',
        'Waved back at someone who wasn\'t actually waving at me','Talked to myself in public',
      ];
      await sock.sendMessage(chatId, {
        text: `┏✧ *${botName} NEVER HAVE I EVER*\n┃\n┃ Never have I ever...\n┃ *${items[_rnd(items.length)]}*\n┃\n┃ Raise your hand ✋ if you have!\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

  
// ============================
  // ADVICE
  // ============================
  {
    name: 'advice',
    aliases: ['randomadvice', 'tipofday'],
    category: 'fun',
    description: 'Get a random piece of advice',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      try {
        const res = await axios.get('https://api.adviceslip.com/advice', { timeout: 8000 });
        const adv = res.data.slip?.advice || 'Keep going. You are doing great!';
        await sock.sendMessage(chatId, {
          text: `┏✧ *${botName} ADVICE*\n┃\n┃ ${adv}\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      } catch {
        const tips = ['Drink more water. 💧','Get enough sleep every night. 🌙','Call someone you love today. 📞','Step outside for 5 minutes. 🌿','Put your phone down and breathe. 🧘'];
        await sock.sendMessage(chatId, { 
          text: `┏✧ *${botName} ADVICE*\n┃\n┃ ${tips[_rnd(tips.length)]}\n┗✧`, 
          ...channelInfo 
        }, { quoted: fake });
      }
    }
  },

// ============================
  // FORTUNE COOKIE
  // ============================
  {
    name: 'fortune',
    aliases: ['fortunecookie', 'cookie'],
    category: 'fun',
    description: 'Get a fortune cookie message',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const fortunes = [
        'A great adventure awaits you soon.','Your hard work is about to pay off.','Today is a good day to make new friends.',
        'A surprise is heading your way!','Be patient. Good things take time.','You will achieve something great this week.',
        'A new opportunity is about to knock on your door.','The star of riches is shining upon you.',
        'Your kindness will return to you tenfold.','Someone special is thinking about you right now.',
        'A small act of courage will change your life.','Believe in yourself and magic will happen.',
        'Your greatest strength is your perseverance.','Joy is on its way to you.',
        'Look for the light at the end of the tunnel — it is there.',
      ];
      const lucky = Math.floor(Math.random() * 10000);
      await sock.sendMessage(chatId, {
        text: `┏✧ *${botName} FORTUNE*\n┃\n┃ *"${fortunes[_rnd(fortunes.length)]}"*\n┃\n┃ 🍀 *Lucky number:* ${lucky}\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },


// ============================
  // ROCK PAPER SCISSORS
  // ============================
  {
    name: 'rps',
    aliases: ['rockpaperscissors', 'rockpaper'],
    category: 'fun',
    description: 'Play rock paper scissors vs bot',
    usage: '.rps rock',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const choices = ['rock', 'paper', 'scissors'];
      const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
      const player = (args[0] || '').toLowerCase();
      if (!choices.includes(player)) return sock.sendMessage(chatId, { text: `┏✧ *${botName}*\n┃ Usage: .rps rock/paper/scissors\n┗✧` }, { quoted: fake });
      const bot = choices[_rnd(3)];
      let result;
      if (player === bot) result = '🟡 *It\'s a tie!*';
      else if ((player === 'rock' && bot === 'scissors') || (player === 'paper' && bot === 'rock') || (player === 'scissors' && bot === 'paper')) result = '🟢 *You win!*';
      else result = '🔴 *Bot wins!*';
      await sock.sendMessage(chatId, {
        text: `┏✧ *${botName} RPS*\n┃\n┃ *You:* ${emojis[player]} ${player}\n┃ *Bot:* ${emojis[bot]} ${bot}\n┃\n┃ ${result}\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

  
// ============================
  // THIS OR THAT
  // ============================
  {
    name: 'thisorthat',
    aliases: ['tot', 'chooseone'],
    category: 'fun',
    description: 'This or That choice game',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      if (args.length >= 2) {
        const midpoint = Math.floor(args.length / 2);
        const a = args.slice(0, midpoint).join(' ');
        const b = args.slice(midpoint).join(' ');
        await sock.sendMessage(chatId, {
          text: `┏✧ *${botName} THIS OR THAT*\n┃\n┃ 👉 ${a}\n┃ *vs*\n┃ 👈 ${b}\n┃\n┃ Which do you prefer?\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      } else {
        const pairs = [['Coffee','Tea'],['Android','iPhone'],['Morning person','Night owl'],['Beach','Mountains'],['Netflix','YouTube'],['Summer','Winter']];
        const [a, b] = pairs[_rnd(pairs.length)];
        await sock.sendMessage(chatId, {
          text: `┏✧ *${botName} THIS OR THAT*\n┃\n┃ 👉 *${a}*\n┃ *vs*\n┃ 👈 *${b}*\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      }
    }
  },

  // ============================
  // LUCKY NUMBER
  // ============================
  {
    name: 'luckynumber',
    aliases: ['lucky', 'mylucky'],
    category: 'fun',
    description: 'Get your lucky number for today',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const seed = senderId + new Date().toDateString();
      let hash = 0;
      for (const c of seed) hash = ((hash << 5) - hash) + c.charCodeAt(0);
      const num = Math.abs(hash % 1000);
      const emojis = ['🍀', '⭐', '💫', '🌟', '✨', '🎯', '🎰', '🔮'];
      const emoji = emojis[num % emojis.length];
      await sock.sendMessage(chatId, {
        text: `┏✧ ${emoji} *${botName} LUCKY NUMBER*\n┃\n┃ *Today's Lucky Number:*\n┃ *${num}*\n┃\n┃ Use it wisely!\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },

  
  //// ============================
  // BAD IDEA GENERATOR
  // ============================
  {
    name: 'badidea',
    aliases: ['terribleidea', 'whatif'],
    category: 'fun',
    description: 'Generate a hilariously bad idea',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const actions = ['text your ex','eat spicy food before a job interview','buy','delete','share','try to fix','post about'];
      const objects = ['a whole pizza at 3am','your boss\'s secret','the database (without backup)','a bee hive','your browser history','a tiger','your credit card info'];
      const contexts = ['on a Monday morning','right before an exam','at a family dinner','live on social media','in front of everyone','while sleepy','on your first date'];
      const idea = `${actions[_rnd(actions.length)]} ${objects[_rnd(objects.length)]} ${contexts[_rnd(contexts.length)]}`;
      await sock.sendMessage(chatId, {
        text: `┏✧ 💡 *${botName} BAD IDEA*\n┃\n┃ *Today's terrible idea:*\n┃ Why not... ${idea}?\n┃\n┃ _Do NOT actually do this_ 😭\n┗✧`,
        ...channelInfo
      }, { quoted: fake });
    }
  },
 //============================
  // NAUGHTY RATE
  // ============================
  {
    name: 'naughtyrate',
    aliases: ['naughty', 'innocentcheck'],
    category: 'fun',
    description: 'Check naughty/innocent level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const lvl = pct >= 90 ? '😈 Absolutely Naughty' : pct >= 70 ? '😏 Pretty Naughty' : pct >= 50 ? '😅 Somewhat Naughty' : pct >= 30 ? '😇 Mostly Innocent' : '👼 Pure Angel';
      const bar = '😈'.repeat(Math.round(pct / 10)) + '😇'.repeat(10 - Math.round(pct / 10));
      await sock.sendMessage(chatId, {
        text: `┏✧ 😇 *${botName} NAUGHTY RATE*\n┃\n┃ *User:* ${name}\n┃ ${bar}\n┃ *Score:* ${pct}%\n┃ *Level:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },


  // ============================
  // CRINGE METER
  // ============================
  {
    name: 'cringe',
    aliases: ['cringerate', 'cringemeter'],
    category: 'fun',
    description: 'Check cringe level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const bar = '😬'.repeat(Math.round(pct / 10)) + '😎'.repeat(10 - Math.round(pct / 10));
      const lvl = pct >= 80 ? 'Maximum Cringe 😬' : pct >= 60 ? 'Very Cringy 😅' : pct >= 40 ? 'Mild Cringe' : 'Not That Cringy 😎';
      await sock.sendMessage(chatId, {
        text: `┏✧ 😬 *${botName} CRINGE METER*\n┃\n┃ *User:* ${name}\n┃ ${bar} ${pct}%\n┃ *Level:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // TRUST METER
  // ============================
  {
    name: 'trustrate',
    aliases: ['trust', 'trustcheck'],
    category: 'fun',
    description: 'Check trust level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const lvl = pct >= 90 ? '✅ Ride or Die' : pct >= 70 ? '🤝 Very Trustworthy' : pct >= 50 ? '😐 Depends on the mood' : pct >= 30 ? '🤨 Sketchy' : '🚩 Do not trust!';
      await sock.sendMessage(chatId, {
        text: `┏✧ 🤝 *${botName} TRUST METER*\n┃\n┃ *User:* ${name}\n┃ *Trust:* ${pct}%\n┃ *Verdict:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

  // ============================
  // AESTHETIC TEXT
  // ============================
  {
    name: 'aesthetic',
    aliases: ['vaporwave', 'fullwidth'],
    category: 'fun',
    description: 'Convert text to aesthetic full-width style',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const text = args.join(' ');
      if (!text) return sock.sendMessage(chatId, { text: `┏✧ *${botName}*\n┃ Provide text.\n┗✧` }, { quoted: fake });
      const result = [...text].map(c => {
        const code = c.charCodeAt(0);
        if (code >= 0x21 && code <= 0x7e) return String.fromCharCode(code + 0xFF01 - 0x21);
        if (c === ' ') return '\u3000';
        return c;
      }).join('');
      await sock.sendMessage(chatId, { text: result, ...channelInfo }, { quoted: fake });
    }
  },


  // ============================
  // LOVE RATE
  // ============================
  {
    name: 'loverate',
    aliases: ['heartrate', 'lovemeter'],
    category: 'fun',
    description: 'Calculate love rate from names',
    usage: '.loverate Alice Bob',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      let p1, p2;
      if (mentions.length >= 2) { p1 = `@${mentions[0].split('@')[0]}`; p2 = `@${mentions[1].split('@')[0]}`; }
      else if (args.length >= 2) { p1 = args[0]; p2 = args.slice(1).join(' '); }
      else return sock.sendMessage(chatId, { text: `┏✧ *${botName}*\n┃ Usage: .loverate name1 name2\n┗✧` }, { quoted: fake });
      const pct = _pct();
      const bar = '❤️'.repeat(Math.round(pct / 10)) + '🤍'.repeat(10 - Math.round(pct / 10));
      const msg = pct >= 80 ? 'Perfect match! 💞' : pct >= 60 ? 'Good compatibility! 💕' : pct >= 40 ? 'Could work! 💛' : pct >= 20 ? 'Needs work... 💔' : 'Not a match 😬';
      await sock.sendMessage(chatId, {
        text: `┏✧ ❤️ *${botName} LOVE RATE*\n┃\n┃ ${p1} ❤️ ${p2}\n┃ ${bar}\n┃ *Score:* ${pct}% — ${msg}\n┗✧`,
        mentions: mentions.length >= 2 ? [mentions[0], mentions[1]] : [],
        ...channelInfo
      }, { quoted: fake });
    }
  },

// ============================
  // SMART RATE
  // ============================
  {
    name: 'smartrate',
    aliases: ['smartcheck', 'brainrate'],
    category: 'fun',
    description: 'Check smart/brain level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const bar = '🧠'.repeat(Math.round(pct / 10)) + '🪫'.repeat(10 - Math.round(pct / 10));
      const lvl = pct >= 90 ? 'Einstein level 🧠' : pct >= 70 ? 'Pretty smart 📚' : pct >= 50 ? 'Average brain 😐' : pct >= 30 ? 'Still learning 📝' : 'Galaxy-brained 🌀';
      await sock.sendMessage(chatId, {
        text: `┏✧ 🧠 *${botName} SMART RATE*\n┃\n┃ *User:* ${name}\n┃ ${bar} ${pct}%\n┃ *Level:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },

// ============================
  // GTA ACHIEVEMENT
  // ============================
  {
    name: 'gtaachievement',
    aliases: ['gta', 'achievement'],
    category: 'fun',
    description: 'Generate a funny GTA-style achievement',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const achievements = [
        { title: 'The Early Bird', desc: 'Woke up before noon for the first time.' },
        { title: 'Fast Food Connoisseur', desc: 'Ordered the same meal 3 times in a row.' },
        { title: 'Social Butterfly', desc: 'Actually replied to a message the same day.' },
        { title: 'Hydration Hero', desc: 'Drank a full glass of water without being told.' },
        { title: 'Night Owl', desc: 'Stayed up until 4 AM for absolutely no reason.' },
        { title: 'The Overthinker', desc: 'Took 2 hours to write a 3-word text.' },
        { title: 'Battery Survivor', desc: 'Survived the day on 1% battery charge.' },
        { title: 'The Ghost', desc: 'Left someone on read for 3 days.' },
        { title: 'Meme Lord', desc: 'Sent 10 memes in under a minute.' },
        { title: 'The Professional Procrastinator', desc: 'Delayed the inevitable until tomorrow.' },
      ];
      const { title, desc } = achievements[_rnd(achievements.length)];
      await sock.sendMessage(chatId, {
        text: `┏✧ 🏆 *${botName} GTA ACHIEVEMENT*\n┃\n┃ *${name} unlocked:*\n┃\n┃ 🎖️ *${title}*\n┃ ${desc}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },


// ============================
  // LOYALTY CHECK
  // ============================
  {
    name: 'loyalty',
    aliases: ['loyaltycheck', 'loyalrate'],
    category: 'fun',
    description: 'Check loyalty level',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentions[0] || senderId;
      const name = `@${target.split('@')[0]}`;
      const pct = _pct();
      const bar = '💎'.repeat(Math.round(pct / 10)) + '💀'.repeat(10 - Math.round(pct / 10));
      const lvl = pct >= 90 ? '💎 Ride or Die' : pct >= 70 ? '✅ Very Loyal' : pct >= 50 ? '😐 Depends...' : pct >= 30 ? '🚩 Kinda Sus' : '💔 Total Traitor';
      await sock.sendMessage(chatId, {
        text: `┏✧ 💎 *${botName} LOYALTY CHECK*\n┃\n┃ *User:* ${name}\n┃ ${bar} ${pct}%\n┃ *Rating:* ${lvl}\n┗✧`,
        mentions: [target],
        ...channelInfo
      }, { quoted: fake });
    }
  },


// ============================
  // ANIME QUOTE
  // ============================
  {
    name: 'animequote',
    aliases: ['aq', 'aniquote'],
    category: 'fun',
    description: 'Get a random anime quote',
    execute: async (sock, message, args, context) => {
      const { chatId, senderId } = context;
      const botName = getBotName();
      const fake = _fake(senderId);
      try {
        const res = await axios.get('https://animechan.io/api/v1/quotes/random', { timeout: 8000 });
        const q = res.data.data;
        await sock.sendMessage(chatId, {
          text: `┏✧ 🎌 *${botName} ANIME QUOTE*\n┃\n┃ "${q.content}"\n┃\n┃ — *${q.character.name}*\n┃ _(${q.anime.name})_\n┗✧`,
          ...channelInfo
        }, { quoted: fake });
      } catch {
        const quotes = [
          { q: 'People\'s lives don\'t end when they die. It ends when they lose faith.', c: 'Itachi Uchiha', a: 'Naruto' },
          { q: 'The world is not perfect, but it\'s there for us, trying the best it can. That is what makes it so damn beautiful.', c: 'Roy Mustang', a: 'FMA' },
          { q: 'Believe in yourself. Not in the you who believes in me. Not in the me who believes in you. Believe in the you who believes in yourself.', c: 'Kamina', a: 'TTGL' },
        ];
        const { q, c, a } = quotes[_rnd(quotes.length)];
        await sock.sendMessage(chatId, { 
          text: `┏✧ 🎌 *${botName} ANIME QUOTE*\n┃\n┃ "${q}"\n┃ — *${c}* _(${a})_\n┗✧`, 
          ...channelInfo 
        }, { quoted: fake });
      }
    }
  }
];
