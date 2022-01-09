import * as langDB from "./db"
import * as utils from "../utils"
import LanguageHandler from "./LanguageHandler"
import fs from "fs"
import path from "path"
import glob from "glob"
import LanguageFile from "./LanguageFile"
import * as LanguageIndex from "./db"
import LanguageCode, { languageCodeToString, stringToLanguageCode } from "./LanguageCode"
import EnglishLanguageHandler from "./db/en"
import ChannelLanguageSettings from "./ChannelLanguageSettings"
import { botSettings } from "../bot"
import PortugueseLanguageHandler from "./db/pt"

/**
 * Array containing all loaded LanguageHandlers
 */

const languageHandlers = Array<LanguageHandler>()
/**
 * Default Language
 */
export let defaultLanguage: LanguageCode = LanguageCode.en

export let channelLanguageSettings: ChannelLanguageSettings

/**
 * Load all language files
 */
export function initialize()
{
    utils.PrettyLog("LanguageHandler", "Loading language files...")

    if (!fs.existsSync("./channel_language.json"))
    {
        utils.PrettyLogError("bot.ts", "Cannot find channel language settings configuration file \"channel_language.json\". Aborting...");
        process.abort()
    }
    channelLanguageSettings = require("../../channel_language.json")

    // Check if the ChannelLanguageSettings file exists

    // Set the default language to the language
    defaultLanguage = stringToLanguageCode(botSettings.language)
    utils.PrettyLog("LanguageHandler", `Default language has been set to \'${languageCodeToString(defaultLanguage)}\'`)

    // Create and register language support
    const englishLanguage = new EnglishLanguageHandler()
    englishLanguage.registerLanguage()
    const portugueseLanguage = new PortugueseLanguageHandler()
    portugueseLanguage.registerLanguage()
 
    // List all json files in the language/db folder
    //const languagePath = `db/${ languageCodeToString(currentLanguage) }/**/*.json`
    const languagePath = `db/**/*.json`

    glob.sync(path.resolve(__dirname, languagePath)).forEach((file) => {
        const jsonFileRelativePath: any = ".\\" + path.relative(__dirname, file)
        const langFile: LanguageFile = require(jsonFileRelativePath)
        
        // Searches for the handler
        const handler = LanguageIndex.availableLanguageHandlers.find(
            handler => languageCodeToString(<LanguageCode>handler.languageCode) == langFile.languageCode
        )

        if (handler == null)
        {
            utils.PrettyLogError("LanguageHandler", `Could not find a language handler for \"${langFile.languageCode}\"`)
        }
        
        let sinas = "reproved name"

        if (sinas.match(/^\s*$/)) { console.log("sinas") }
        

        handler?.files.push(langFile)
    })

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
    let langCodeToSearch: LanguageCode = defaultLanguage;

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
                
                langCodeToSearch = stringToLanguageCode(<string>langCode);

            }catch // If language code if invalid, set language code to search to the default language code
            {
                langCodeToSearch = defaultLanguage;
            }
        }

    }
    languageHandler = LanguageIndex.availableLanguageHandlers.find(handler => handler.languageCode == langCodeToSearch);
    
    // If no language handler was found
    if (languageHandler == null)
    {
        throw `Could not find a language handler for language \'${languageCodeToString(langCodeToSearch)}\'`
    }
    
    return <string>languageHandler.get_string(langClass, path, key)
}
  

