export default interface ChannelLanguageSettings
{
    enabled: boolean
    channels: { [channelID: string]: string }
}