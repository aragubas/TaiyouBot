import { Client, Message } from "discord.js"
import * as utils from "../utils"
import { Commands } from "../command_imports"

export default (client: Client): void =>
{
    client.on("ready", async () =>
    {
        if (client.user == null) 
        { 
            utils.PrettyLogFatalError("AuthCheck", "Could not determine the user."); 
            process.abort(); 
        }
    
        if (!client.user.bot)
        {
            utils.PrettyLogFatalError("AuthCheck", "Invalid token, logged in a user and not as a bot."); 
            process.abort(); 
        }
        
        await client.application?.commands.set(Commands)

        utils.PrettyLog("AuthCheck", `Logged in as "${client.user.username}#${client.user.discriminator}"`)
    
    })

}
