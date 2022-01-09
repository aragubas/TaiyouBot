import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, DiscordAPIError, GuildMember, MessageEmbed, UserResolvable } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

export const unban: Command = {
    name: "unban",
    description: "Unban a previously banned user",
    options: [{
        name: "userid",
        description: "UserID of the user to unban",
        type: "STRING",
        required: true
    },
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        // Check if user has permission to ban members
        if (!interaction.memberPermissions?.has("BAN_MEMBERS")) 
        {  
            await interaction.reply({ 
                ephemeral: true,
                content: getString(interaction.channelId, "unban", "errors", "ban_permission")
            });
            return
        }
        
        // Gets the userIDValue from the arguments
        const { value: userIDValue } = interaction.options.data[0]
        try
        {
            // Tries to unban the user
            await interaction.guild?.members.unban(userIDValue as string)
            

            // Send the success unbanned message
            await interaction.reply({
                ephemeral: false,
                content: utils.leafletInterpolater(getString(interaction.channelId, "unban", "successful_response", "head"), { user: `<@${userIDValue}>` })
            });
            

        }catch(err)
        {
            // User already unbanned or not banned
            if (err instanceof DiscordAPIError && err.httpStatus == 404)
            {
                await interaction.reply({
                    ephemeral: true,
                    content: getString(interaction.channelId, "unban", "errors", "user_already_unbanned")
                });  
                return;  
            }
            
            // User not found
            if (err instanceof DiscordAPIError && err.httpStatus == 400)
            {
                await interaction.reply({
                    ephemeral: true,
                    content: getString(interaction.channelId, "generic_errors", "errors", "user_not_found")
                });    
                return
            }

            // Unhandled error
            await interaction.reply({
                ephemeral: true,
                content: utils.leafletInterpolater(getString(interaction.channelId, "generic_errors", "errors", "internal_error"), { error: err })
            });    

        }

    }
}