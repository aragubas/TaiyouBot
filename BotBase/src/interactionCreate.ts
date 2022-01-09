import { BaseCommandInteraction, Client, Interaction } from "discord.js";
import { Commands } from "./command_imports";
import { botSettings } from "./bot";
import * as utils from "./utils"

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        // Guild is null when a user tries to use the bot from a DM
        if (interaction.guild == null && !botSettings.allow_dm) 
        {  
            return;
        }
        
        if (interaction.isCommand() || interaction.isContextMenu())
        {
            await handleSlashCommand(client, interaction);
        }
    })
}

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    // Check if interaction came from a dm, if bot is not allowed to run in dm's, return, and does not allow commands from bots
    if (interaction.guild == null && !botSettings.allow_dm || interaction.user.bot)
    {
        return;
    }

    const slashCommand = Commands.find(command => command.name == interaction.commandName);

    if (!slashCommand)
    {
        interaction.reply({content: "ERROR: Command not found.", ephemeral: true})
        return;
    }
 
    try
    {
        await slashCommand.run(client, interaction);

    }catch (error)
    { 
        utils.PrettyLogError("InteractionHandler", `Error while running interaction.\n\n${error}`)
    }
}