import LanguageHandler from "../LanguageHandler"
import * as en from "./en"

/**
 * All language handlers that are currently loaded
 */
export const availableLanguageHandlers = Array<LanguageHandler>()
/**
 * Reference to the fallback language
 */
export let properties = { fallbackHandler: LanguageHandler };