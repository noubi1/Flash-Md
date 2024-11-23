const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK0dLSENiWC9xNnM1eWRaQTNhVU1XbDh6Ymk1R3ZYV0N0VTM1dEc1SytVZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiclRxWldJSHpEQlQ5ekRlenhpY3VTeUREWDhrK0UxMDE5NUx3V1ZXL0gyTT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFSnNMeW9wRWU1b0J6amxMV2x4c3JIY21lZTJxYXVhMWYwV3kvUTk1akVBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLT2w1cUdORXhINE42MVhaNzZYNTdSWEhtNXV5OXlQZjJSL013Tk5jbDE4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNQUGdkSEQ3ajhTMCtyL2N5Sm9yWW43UTU3WUE2enhuTlBGUmhVYktLVk09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhhVzBucVBGMWdjTmVyOXpuY0FmTy9Zb003emN1d1hLQkNDQlJZTjFmR2c9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0JlTFNncTFHbENpODEzRWo3eHM5cHh3bUl5bGpiZFhSdkMzNUo2U2FsYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNUNodU9ZZklLeEZOK0hKckpZMU5jR0VvVkEwbG1yQWJLV3V3QmpUa1FSRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVHWm1XNmhWMmNkeEtlaXBjeS9kb3JGcHlDY2tCMDNqK3hXcWhWVExyS0ROSm1LajJUSkpRdjN6YUx0aGM2cHBkcHV1eTk5TS9YZHhGazkrbVArNEFBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjE3LCJhZHZTZWNyZXRLZXkiOiJqdkgzMTRpYjA0OGFlZWdCWVBFTjRyUzA5TTJkcnJnV0V2K2E0SWJpRU44PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJkSGhkOFVCWVNTVzVDcG1MVVVvV1VRIiwicGhvbmVJZCI6IjdiYmRiODE1LTViYWYtNDVjZi1hN2Q5LWIzOWZlMDljYzU1OCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIxenZNcnZFclJRbG96ZWUxN2hNd09WNHlDODQ9In0sInJlZ2lzdGVyZWQiOmZhbHNlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRkSklQN0MzL2h5cDdLUWxKTWRPSDcrSHhITT0ifSwicmVnaXN0cmF0aW9uIjp7fSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ1BMMS9Jb0VFTEdhaDdvR0dCRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IklSbkp1Q1QvWlFGQktGZ1JNMXI0TXFmZVNRUGRVS2lxNEl5Z00xa21PeDQ9IiwiYWNjb3VudFNpZ25hdHVyZSI6InN5OVhtbHIzd01taU51bmRaV2FzM25taEh1VWxOdVlqNzNGTTlmQ04xd3lHaHlYR1F6b2c1Qzk1ZFJ6clEwaDNGTWVzSkVieEhramNnY0ZLc2FlQ2dRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiIxKzhRSEp0SXYzYi8rT0pTOWx4cmFVTkJsY2xEVzVWZ2t1NGQ5NnczazBUcDFpUkwwcjI5V1RJSHFTOTdacFlscjRwbmZIbnFlSFdxL1FYK0F0c0FDZz09In0sIm1lIjp7ImlkIjoiMjM3NjU4NzcxMjkyOjE1QHMud2hhdHNhcHAubmV0In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIzNzY1ODc3MTI5MjoxNUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJTRVp5YmdrLzJVQlFTaFlFVE5hK0RLbjNra0QzVkNvcXVDTW9ETlpKanNlIn19XSwicGxhdGZvcm0iOiJpcGhvbmUiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzIzNjU2MjAsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBRGNPIn0=',
    PREFIXES: (process.env.PREFIX || '').split('!').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Jores",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254105915061",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'on',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'off',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
