async function isAdmin(sock, chatId, senderId) {
  try {
    const groupMetadata = await sock.groupMetadata(chatId);
    const botId = sock.user.id;

    // Known phone ↔ LID mappings for the bot owner
    const ownerPhone = (global.ownerPhone || '').replace(/\D/g, '');
    const ownerLid   = (global.ownerLid   || '').replace(/\D/g, '');

    const findParticipant = (id) => {
      const idPhone = (id || '').split('@')[0].split(':')[0].split('.')[0];
      return groupMetadata.participants.find(p => {
        const pPhone = p.id.split('@')[0].split(':')[0].split('.')[0];
        // Direct numeric match
        if (pPhone === idPhone) return true;
        // Phone ↔ LID cross-match using known owner mapping
        if (ownerPhone && ownerLid) {
          if (idPhone === ownerPhone && pPhone === ownerLid) return true;
          if (idPhone === ownerLid   && pPhone === ownerPhone) return true;
        }
        // Baileys sometimes stores the opposite JID type in p.lid
        if (p.lid) {
          const pLid = String(p.lid).split('@')[0].split(':')[0].split('.')[0];
          if (pLid === idPhone) return true;
        }
        return false;
      });
    };

    const participant = findParticipant(senderId);
    const bot = findParticipant(botId);

    const isBotAdmin = !!(bot && (bot.admin === 'admin' || bot.admin === 'superadmin'));
    const isSenderAdmin = !!(participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));

    return { isSenderAdmin, isBotAdmin };
  } catch (error) {
    return { isSenderAdmin: false, isBotAdmin: false };
  }
}

module.exports = isAdmin;
