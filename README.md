# Issah X Bot

<p align="center">
  <strong>A fast WhatsApp bot for groups, media, AI, automation, and entertainment.</strong>
</p>

<p align="center">
  <a href="https://github.com/issah255-Tech/ISSA-XMD"><img src="https://img.shields.io/badge/ISSAH_TECH-REPOSITORY-52525B?style=for-the-badge&labelColor=18181B&logo=github&logoColor=F4F4F5" alt="Issah Tech Repository"></a>
  <a href="https://github.com/issah255-Tech/ISSA-XMD"><img src="https://img.shields.io/badge/PAIRING_GUIDE-OPEN-52525B?style=for-the-badge&labelColor=18181B&logo=whatsapp&logoColor=F4F4F5" alt="Open Pairing Guide"></a>
</p>

## About

Issah X Bot is a multi-device WhatsApp automation bot with group administration, moderation, media processing, AI tools, downloaders, games, status utilities, and configurable automation features.

The bot is designed for a standard Node.js runtime. Credentials, session data, API keys, and database files belong in the deployment environment and must not be committed to the project.

## Setup

```bash
npm install
npm start
```

Configure the required environment variables on the host before starting the bot. If no valid WhatsApp session is available, follow the pairing instructions displayed by the process.

## Examples

```text
.menu
.ping
.tosgroup Group announcement
.tourl
.sticker
.play song name
```

Use `.menu` in WhatsApp to view the current command catalogue. Some commands require owner, sudo, or group-administrator access.

## Features

- Group management, moderation, protection, and member tools.
- Text, image, video, audio, document, and sticker utilities.
- Music and video download commands with provider fallbacks.
- AI chat, lyrics, sports, anime, search, and other API-backed tools.
- Auto-read, auto-react, auto-typing, auto-recording, and chatbot modes.
- Owner settings, anti-delete, anti-edit, status tools, and runtime controls.
- Group-status posting through `.tosgroup` and its active aliases.

## Project

The official project repository is maintained by **Issah Tech**:

[![Open ISSA-XMD Repository](https://img.shields.io/badge/OPEN_ISSA--XMD_REPOSITORY-52525B?style=for-the-badge&labelColor=18181B&logo=github&logoColor=F4F4F5)](https://github.com/issah255-Tech/ISSA-XMD)

## Security

Never publish WhatsApp authentication state, pairing information, access tokens, private API keys, `.env` files, SQLite databases, logs, or runtime directories. Keep backups private and share only redacted error output.

## Credits

**Issah X Bot** is maintained and branded by **Issah Tech**.

**© 2026 Issah Tech. All rights reserved.**
