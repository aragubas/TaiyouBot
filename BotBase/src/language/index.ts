import * as utils from "../utils"
import LanguageHandler from "./LanguageHandler"
import fs from "fs"
import path from "path"
import glob from "glob"
import LanguageFile from "./LanguageFile"
import ChannelLanguageSettings from "./ChannelLanguageSettings"
import { botSettings } from "../bot"
import { DataPath } from "../bot"
import LanguageHandlerConfigFile from "./LanguageHandlerConfigFile"

/**
 * Array containing all loaded LanguageHandlers
 */

const languageHandlers = Array<LanguageHandler>()
/**
 * Default Language
 */
export let defaultLanguage: string
export let channelLanguageSettings: ChannelLanguageSettings
export let availableLanguageHandlers: LanguageHandler[] = []
export let options: LanguageHandlerConfigFile

/**
 * Load all language files
 */
export function initialize()
{
    utils.PrettyLog("LanguageHandler", "Parsing language files...")

    if (!fs.existsSync(path.join(DataPath, "channel_language.json")))
    {
        utils.PrettyLogFatalError("LanguageHandler", "Cannot find configuration file \"channel_language.json\". Aborting...");
        process.abort()
    }

    // Import channel language settings
    channelLanguageSettings = require(path.join(DataPath, "channel_language.json"))

    // Set the default language to the language
    defaultLanguage = botSettings.language

    utils.PrettyLog("LanguageHandler", `Default language has been set to \'${defaultLanguage}\'`)
    
    /*
        ========
        = Parse language handlers
        ========
    */

    // Register language handlers
    if (!fs.existsSync(path.join(DataPath, "language_handler.json"))) // Check if language_handlers.json exists
    {
        utils.PrettyLogFatalError("LanguageHandler", "Cannot find configuration file \"language_handler.json\". Aborting...");
        process.abort()

    }

    options = require(path.join(DataPath, "language_handler.json"))

    // Register the language handlers
    options.language_handlers.forEach(handler => {
        let langClass: LanguageHandler = new LanguageHandler();
        langClass.name = handler.name
        langClass.languageCode = handler.language_code
        
        langClass.isFallbackLanguage = langClass.languageCode == botSettings.language

        availableLanguageHandlers.push(langClass)
        utils.PrettyLog("LanguageHandler", `Parsed language handler for \"${langClass.name}\"`)
    });

    /*
        ========
        = Load language files
        ========
    */

    // List all json files in the language_files folder inside data path    
    glob.sync(`${path.join(DataPath, "language_files")}/**/*.json`).forEach((file) => {
        const jsonFileRelativePath: any = "./" + path.relative(__dirname, file)
        const langFile: LanguageFile = require(jsonFileRelativePath)

        // Searches for the handler
        const handler = availableLanguageHandlers.find(
            handler => handler.languageCode == langFile.languageCode
        )

        if (handler == null)
        {
            utils.PrettyLogError("LanguageHandler", `Could not find a language handler for \"${langFile.languageCode}\";\n    File: ${jsonFileRelativePath}`)
        }

        handler?.files.push(langFile)
    })

    // Optional: Print summary for loaded handlers
    if (options.print_summary)
    {
        console.log("\n")       
        utils.PrettyLog("LanguageHandler", "Summary: \n")
        availableLanguageHandlers.forEach(handler => {
            utils.PrettyLog("LanguageHandler", `  ${handler.name}`)
            utils.PrettyLog("LanguageHandler", `    ; Language Files: ${handler.files.length}`)
            utils.PrettyLog("LanguageHandler", `    ; Language Code: ${handler.languageCode}\n`) 
        });
    
        console.log("\n")       
    }


    utils.PrettyLog("LanguageHandler", "Done!")
}

/**
 * Gets a string from the language set to specified topic
 * @param langClass Class (or namespace) of the language file
 * @param path Path (or subfolder of class) of the language file
 * @param key Name of a key inside contents object inside the language file
 * @returns 
 */
export function getString(channelID: string, langClass: string, path: string, key: string): string
{
    let languageHandler: LanguageHandler | undefined = undefined;
    let langCodeToSearch = defaultLanguage;

    // If per-channel language is not enabled, set lang code to search to the default language lang code
    if (!channelLanguageSettings.enabled) 
    {
        langCodeToSearch = defaultLanguage;

    }else // Tries to find the specified channel's language
    {
        let langCode: string | undefined = channelLanguageSettings.channels[channelID]

        // This channel has no language setting defined. set to the default language
        if (langCode == undefined)
        {
            langCodeToSearch = defaultLanguage;
            
        }else // Else, try to get the language code defined on the settings file for this specific channel id
        {  
            try{
                
                langCodeToSearch = langCode;

            }catch // If language code if invalid, set language code to search to the default language code
            {
                langCodeToSearch = defaultLanguage;
            }
        }

    }
    languageHandler = availableLanguageHandlers.find(handler => handler.languageCode == langCodeToSearch);
    
    // If no language handler was found
    if (languageHandler == null)
    {
        throw `Could not find a language handler for language \'${langCodeToSearch}\'`
    }
    
    return <string>languageHandler.get_string(langClass, path, key)
}
  

