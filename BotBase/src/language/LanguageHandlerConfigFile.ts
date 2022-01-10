export interface LanguageHandlerConfigFileHandlersField
{
    name: string,
    language_code: string
}

export default interface LanguageHandlerConfigFile
{
    print_summary: boolean
    language_handlers: LanguageHandlerConfigFileHandlersField[]
}
