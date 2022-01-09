/**
 * Interface for JSON languages files
 */
export default interface LanguageFile
{
    languageClass: string
    path: string
    languageCode: string
    contents: { [key: string]: string }
}
