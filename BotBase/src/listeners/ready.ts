import { Client, Message } from "discord.js"
import * as utils from "../utils"
import { Commands } from "../command_imports"

export default (client: Client): void =>
{
    client.on("ready", async () =>
    {
        if (client.user == null) 
        { 
            utils.PrettyLogError("bot.ts AuthenticationChecks", "Incorrect token or no token provided."); 
            process.abort(); 
        }
    
        if (!client.user.bot)
        {
            utils.PrettyLogError("bot.ts AuthenticationChecks", "Invalid token, logged in a user and not as a bot."); 
            process.abort(); 
        }
        
        await client.application?.commands.set(Commands)

        utils.PrettyLog("bot.ts AuthenticationChecks", "Everything seems to be fine. Authentication Check Complete")
        utils.PrettyLog("bot.ts AuthenticationChecks", `Authenticated as "${client.user.username}#${client.user.discriminator}"`)
    
    })

}
