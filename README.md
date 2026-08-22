# Issah X Bot

<p align="center">
  <strong>Fast WhatsApp automation for groups, media, AI, and everyday utilities.</strong>
</p>

<p align="center">
  <a href="https://github.com/issah255-Tech/ISSA-XMD"><img src="https://img.shields.io/badge/REPOSITORY-ISSA--XMD-52525B?style=for-the-badge&labelColor=18181B&logo=github&logoColor=F4F4F5" alt="ISSA-XMD repository"></a>
  <a href="https://heroku.com/deploy?template=https://github.com/issah255-Tech/ISSA-XMD"><img src="https://img.shields.io/badge/HEROKU-DEPLOY-52525B?style=for-the-badge&labelColor=18181B&logo=heroku&logoColor=F4F4F5" alt="Deploy to Heroku"></a>
  <a href="https://github.com/issah255-Tech/ISSA-XMD/fork"><img src="https://img.shields.io/badge/FORK-ISSA--XMD-52525B?style=for-the-badge&labelColor=18181B&logo=github&logoColor=F4F4F5" alt="Fork ISSA-XMD"></a>
</p>

<p align="center">
  <a href="https://github.com/issah255-Tech/ISSA-XMD/archive/refs/heads/main.zip"><img src="https://img.shields.io/badge/DOWNLOAD-SOURCE-71717A?style=for-the-badge&labelColor=27272A&logo=github&logoColor=F4F4F5" alt="Download source"></a>
  <a href="https://github.com/issah255-Tech/ISSA-XMD#setup"><img src="https://img.shields.io/badge/PAIRING-GUIDE-71717A?style=for-the-badge&labelColor=27272A&logo=whatsapp&logoColor=F4F4F5" alt="Pairing guide"></a>
</p>

## About

**Issah X Bot** is a multi-device WhatsApp bot maintained by **Issah Tech**. It combines group administration, moderation, media tools, AI utilities, downloaders, games, status features, and configurable automation in one Node.js project.

The public repository contains the obfuscated runtime source. Keep WhatsApp authentication state, credentials, API keys, databases, and logs outside the repository.

## Deploy with Heroku

The repository is prepared for Heroku container deployment. The root contains `app.json`, `Dockerfile`, and `heroku.yml`; the app manifest points to this repository and declares the worker process and PostgreSQL add-on.

[![Deploy Issah X Bot to Heroku](https://img.shields.io/badge/DEPLOY_ISSAH_X_BOT-HEROKU-52525B?style=for-the-badge&labelColor=18181B&logo=heroku&logoColor=F4F4F5)](https://heroku.com/deploy?template=https://github.com/issah255-Tech/ISSA-XMD)

After deployment, set the required `SESSION_ID` configuration variable in the Heroku app. The supported session prefixes are `ISSAH-X-BOT:`, `ISSAH-X:~`, `ISSAH-X:`, `SESSION:`, `BAILEYS:`, and `MD:`.

## Run locally

```bash
npm install
npm start
```

If no valid session is configured, follow the pairing instructions shown by the bot process. Do not place a real session string in a committed file.

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

## Official project

[![Open ISSA-XMD](https://img.shields.io/badge/OPEN-ISSA--XMD-52525B?style=for-the-badge&labelColor=18181B&logo=github&logoColor=F4F4F5)](https://github.com/issah255-Tech/ISSA-XMD)

The project is maintained and branded by **Issah Tech**.

## Security

Never publish WhatsApp authentication state, pairing information, access tokens, private API keys, `.env` files, SQLite databases, logs, or runtime directories. Keep backups private and share only redacted error output.

## Credits

**Issah X Bot** — maintained by **Issah Tech**.

**© 2026 Issah Tech. All rights reserved.**
