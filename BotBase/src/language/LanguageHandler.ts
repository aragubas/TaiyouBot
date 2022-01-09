import LanguageCode, { languageCodeToString, stringToLanguageCode } from "./LanguageCode";
import LanguageFile from "./LanguageFile";
import * as LanguageIndex from "./db/"
import * as utils from "../utils"
import { botSettings } from "../bot";

/**
 * Class for implementing language support
 */
export default class LanguageHandler
{
    /**
     * Language code (such as 'pt' or 'en')
     */
    languageCode: LanguageCode | undefined = undefined;
    
    /**
     * Human readable name of target language
     */
    name: string = "" 
    /**
     * Language files path inside `language\db`
     */
    langPath : string = ""
    /**
     * Array containing all `LanguageFile` JSON Objects
     */
    files: Array<LanguageFile> = new Array<LanguageFile>()
    isFallbackLanguage = false

    /**
     * Register this language into the available language handlers
     */
    registerLanguage()
    {
        LanguageIndex.availableLanguageHandlers.push(this);
         
        if (stringToLanguageCode(botSettings.language) == this.languageCode) 
        {  
            this.isFallbackLanguage = true;
        }

        let logConcat: string = "."
 
        if (this.isFallbackLanguage) { logConcat = " as the fallback language."; }

        utils.PrettyLog("LanguageHandler", `Language \"${this.name}\" has been registred${logConcat}`)
    }

    /**
     * (Should not be overwriten) Gets a string from a language file loaded in this handler
     * @param langClass Language class or namespace
     * @param path Language path inside this class
     * @param key Language key name
     * @returns Language contents
     */
    get_string(langClass: string, path: string, key: string): string | undefined
    {
        const langFile: LanguageFile | undefined = this.files.find(pth => pth.languageClass == langClass.toLowerCase() && pth.path == path.toLowerCase());
        

        // If language class was not found
        if (langFile == undefined) 
        { 
            // If this is the fallback language, throw an exception
            if (this.isFallbackLanguage)
            {
                throw `Language string for class "${langClass}", path "${path}" and key ${key} has been not found for language '${languageCodeToString(<LanguageCode>this.languageCode)}'` 
            }

            // Tries to find the string in the fallback language
            try
            {
                const fallbackLanguage: LanguageHandler | undefined = LanguageIndex.availableLanguageHandlers.find(handler => handler.isFallbackLanguage)

                if (fallbackLanguage == null)
                {
                    throw `No fallback language has been found. Configuration may be incorrect; please conside checking language property at "bot_settings.json"` 
                }
                                
                const responseString = fallbackLanguage.get_string(langClass, path, key)
                
                utils.PrettyLogError(`LanguageHandler`, `Language string for class "${langClass}", path ${path}, and key "${key}" has been not found for language "${languageCodeToString(<LanguageCode>this.languageCode)}"\n    but found in Fallback language.`)
                
                return responseString;

            }catch(err) // String not found in fallback language
            {
                throw `Language string for class "${langClass}", path "${path}" and key "${key}" has been not found for language "${languageCodeToString(<LanguageCode>this.languageCode)}" and not found in Fallback Language.` 
            }
 
        }

        return langFile?.contents[key]
    }   

}
