import { Client, Intents, Message } from "discord.js"
import path from "path"
import * as utils from "./utils"
import readyListener from "./listeners/ready"
import interactionCreate from "./interactionCreate"
import fs from "fs"
import * as languageHandler from "./language"
import BotSettings from "./BotSettings"

export const DataPath = path.resolve(__dirname, path.join("../", "data"))

// Print initialization message
utils.PrettyLog("bot.ts", `Initialization.\n` + 
                          `   | Data path set to: ${DataPath}`)
 
// Check if bot settings file exists
if (!fs.existsSync(path.resolve(DataPath, "settings.json")))
{
    utils.PrettyLogError("bot.ts", "Cannot find configuration file \"bot_settings.json\". Aborting...");
    process.abort();
}
 
// Load bot settings json
export const botSettings: BotSettings = require(path.resolve(DataPath, "settings.json"))

// Create a new discord client
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],

})

// Set up listeners 
readyListener(client);
interactionCreate(client);

// Async Function for initializating
async function initialize()
{
    // Initialize the language system
    languageHandler.initialize();
    
    if (botSettings.init_test_mode) 
    { 
        utils.PrettyLog("bot.ts", "InitTestMode flag is enabled, no discord login will happen."); 
        return; 
    }

    try
    {
        utils.PrettyLog("bot.ts", "Trying to log in into discord...")

        // Log in into discord
        await client.login(botSettings.token);

    } catch (e)
    {
        utils.PrettyLogError("bot.ts ClientLogin", "No token or invalid token provided.");
        process.abort();
    }
    
}

// Initialize bot services
initialize();