export default interface BotSettings
{
    /**
     * Bot's token for loggin in into discord
     */
    token: string
    /**
     * Start all services but does not log in into discord, and exists
     */
    init_test_mode: boolean
    /**
     * Default language, specified in language code, example: 'en' for english.
     */
    language: string
    /**
     * Allow users to run commands on their dm's
     */
    allow_dm: boolean

}