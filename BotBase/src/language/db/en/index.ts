import LanguageCode from "../../LanguageCode";
import LanguageHandler from "../../LanguageHandler";


/**
 * English Language support for TaiyouBot
 */
export default class EnglishLanguageHandler extends LanguageHandler
{
    constructor()
    {
        super()
        this.name = "English"
        this.languageCode = LanguageCode.en
    }
}

