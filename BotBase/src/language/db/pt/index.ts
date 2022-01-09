import LanguageCode from "../../LanguageCode";
import LanguageHandler from "../../LanguageHandler";


/**
 * Portuguese Language support for TaiyouBot
 */
export default class PortugueseLanguageHandler extends LanguageHandler
{
    constructor()
    {
        super()
        this.name = "Português"
        this.languageCode = LanguageCode.pt
    }
}
