import { Client, DiscordAPIError, Intents, Message } from "discord.js"
import path from "path"
import * as utils from "./utils"
import readyListener from "./listeners/ready"
import interactionCreate from "./interactionCreate"
import fs from "fs"
import * as languageHandler from "./language"
import BotSettings from "./BotSettings"

export const DataPath = path.resolve(__dirname, path.join("../", "data"))

// Print initialization message
utils.PrettyLog("Main", `Initialization\n` + 
                          `   | Data path set to: ${DataPath}`)

// Check if data folder exists
if (!fs.existsSync(DataPath))
{
    utils.PrettyLogError("Main", `Cannot find data path. \"${DataPath}\"\n Aborting...`);
    process.abort();
}

// Check if bot settings file exists
if (!fs.existsSync(path.resolve(DataPath, "settings.json")))
{
    utils.PrettyLogError("Main", "Cannot find configuration file \"settings.json\". Aborting...");
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
        utils.PrettyLog("Main", "InitTestMode; no login will happen"); 
        return; 
    }

    try
    {
        utils.PrettyLog("Main", "Trying to log in into discord...")

        // Log in into discord
        await client.login(botSettings.token);

    } catch (e)
    {
        var errorAny: any = e

        if (errorAny.code == 500)
        {
            utils.PrettyLogFatalError("ClientLogin", "Login Error! Cannot connect to discord servers.");
        }
        
        // Invalid token error
        if (errorAny.code == "TOKEN_INVALID")
        {
            utils.PrettyLogFatalError("ClientLogin", "Login Error! No token or invalid token has been provided.");

        }

        process.abort();
    }
    
}

// Initialize bot services
initialize();
