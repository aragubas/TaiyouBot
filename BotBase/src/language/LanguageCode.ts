/**
 * `Enumerator` with all available languages, defined with a LanguageCode Scheme
 */
enum LanguageCode
{
    en, pt
}

export function languageCodeToString(input: LanguageCode): string
{
    switch(input)
    {
        case LanguageCode.en:
        {
            return "en";
        }

        case LanguageCode.pt:
        {
            return "pt";
        }
    }
}

export function stringToLanguageCode(input: string): LanguageCode
{
    switch(input.toLocaleLowerCase())
    {
        case "en":
        {
            return LanguageCode.en;
        }

        case "pt":
        {
            return LanguageCode.pt;
        }

        default:
        {
            throw `Invalid language code \'${input}\'`         
        }
    }
}


export default LanguageCode