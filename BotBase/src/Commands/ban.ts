import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, DiscordAPIError, GuildMember, MessageEmbed, UserResolvable } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

export const ban: Command = {
    name: "ban",
    description: "Bans specified user, with optional ban reason",
    options: [{
        name: "user",
        description: "User you would like to ban",
        type: "USER",
        required: true
    },
    {
        name: "reason",
        description: "Reason for banning this user",
        type: "STRING",
        required: true
    },
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        const { value: userIDValue } = interaction.options.data[0]
        let banReason = "";
        
        // Check if user is not trying to ban itself
        if (interaction.user.id == userIDValue)
        {
            await interaction.reply({
                ephemeral: false,
                content: getString(interaction.channelId, "ban", "errors", "ban_yourself_error")
            });
            return
        }

        // Check if user has permission to ban members
        if (!interaction.memberPermissions?.has("BAN_MEMBERS")) 
        {  
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "ban_permission")
            });
            return
        }

        // If ban reason was provided, set ban reason to the provided ban reason
        if (interaction.options.data[1] != undefined) { banReason = interaction.options.data[1].value as string }
        
        try
        {
            const userToBan = interaction.guild?.members.resolve(userIDValue as string) as GuildMember;

            // Tries to ban the user
            await interaction.guild?.members.ban(userToBan, { reason: banReason as string });
            
            // Builds the response content
            let responseContent = utils.leafletInterpolater(getString(interaction.channelId, "ban", "successful_response", "head"), { user: `${userToBan.user.username}#${userToBan.user.discriminator}` });
    
            if (banReason == "") 
            {
                responseContent += getString(interaction.channelId, "ban", "successful_response", "no_reason_provided_body")

            } else 
            { 
                responseContent += utils.leafletInterpolater(getString(interaction.channelId, "ban", "successful_response", "reason_provided_body"), { reason: banReason })
            }
    
            await interaction.reply({
                ephemeral: false,
                content: responseContent
            });
            

        }catch(err)
        {
            // User not found
            if (err instanceof DiscordAPIError && err.httpStatus == 400)
            {
                await interaction.reply({
                    ephemeral: true,
                    content: getString(interaction.channelId, "generic_errors", "errors", "user_not_found")
                });
                return;
            }

            
            // Unhandled error
            await interaction.reply({
                ephemeral: true,
                content: utils.leafletInterpolater(getString(interaction.channelId, "generic_errors", "errors", "internal_error"), { error: err })
            });    

        }

    }
}