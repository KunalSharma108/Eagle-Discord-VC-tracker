# Eagle – Discord VC Activity Tracker Bot

Eagle is a Discord bot that logs what users are doing while in a voice channel — whether they're listening to Spotify, designing in Figma, or coding in VS Code — and tracks how long each activity lasted. It provides usage stats through slash commands with multiple time filters.

---

## 🧠 Features

- Tracks **user activity shown in Discord** (like Spotify, VS Code, etc.)
- Only logs activity when:
  - User is **in a voice channel**
  - Bot is **also in the same VC**
- Supports multiple time filters:
  - `Today`, `Past 3 Days`, `Past 7 Days`, `Past Month`
  - `Past 3 Months`, `Past Year`, `All Time`
- Built with **TypeScript**
- Uses **Firebase** for the backend

---

## ⚙️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/KunalSharma108/Eagle-Discord-VC-tracker.git
cd Eagle-Discord-VC-tracker
```

### 2. install Dependencies 
```bash
npm i
```

### 3. Build the project
```bash
npm run build
```

### 4. Start the bot
```bash
npm start
```

### 5. Set the Voice Channel for activity tracking  
Use the following command to set the VC where the bot should monitor activity:  
```
/set-vc [VC Name]
```

### 6. Make the bot join the selected Voice Channel  
Once you've set the VC, ask the bot to join it using:  
```
/join-vc
```

## 📄 Environment Variables

Create a `.env` file in the root directory (same place as `package.json`) and fill it like this:

```ini
TOKEN=YOUR-DISCORD-BOT-TOKEN
APP_ID=YOUR-APP-ID
TEST_SERVER_ID=YOUR-TEST-SERVER-ID
CLIENT_ID=YOUR-CLIENT-ID
```

⚠️ **Never share your `.env` file publicly.**

---

## 🔐 Firebase Setup

To connect to Firebase:

1. Download your `serviceAccountKey.json` from the Firebase Admin SDK.
2. Place it in the root directory (same level as `.env`, `package.json`, etc.)
3. Do **not** place it inside the `src/` folder.

---

## ✅ Slash Commands

Once deployed, use slash commands like:

```bash
/stats duration:'today'
/stats duration:'past 3 days' 
```

Results will include app names and how long each user was active using them.

---

## 📦 Tech Stack

- **Discord.js**
- **TypeScript**
- **Firebase (Admin SDK)**
- **Node.js**

---

## 🚨 Disclaimer

This bot only tracks **visible Discord activities** (like Spotify, VS Code, Figma) and **only while the user _and_ bot are in a voice channel at the same time**. No private data is accessed.

---
