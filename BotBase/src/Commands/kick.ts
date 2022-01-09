import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, GuildMember, MessageEmbed, UserResolvable } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

export const kick: Command = {
    name: "kick",
    description: "Kick a user with specified reason",
    options: [{
        name: "user",
        description: "User you would like to ban",
        type: "USER",
        required: true
    },
    {
        name: "reason",
        description: "Kick reason",
        type: "STRING",
        required: false
    },
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        const { value: userIDValue } = interaction.options.data[0]
        let kickReason = "";

        // Check if user is not trying to kick himself
        if (interaction.user.id == userIDValue)
        {
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "ban", "errors", "ban_yourself_error")
            });
            return
        }

        // Check if user has permission to ban members
        if (!interaction.memberPermissions?.has("KICK_MEMBERS")) 
        {  
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "kick_permission")
            });
            return
        }
        
        // If ban reason was provided, set ban reason to the provided ban reason
        if (interaction.options.data[1] != undefined) { kickReason = interaction.options.data[1].value as string }
        
        // Get the user to kick
        const userToKick = interaction.guild?.members.resolve(userIDValue as string) as GuildMember;

        if (userToKick != null)
        {
            // Tries to ban the user
            await interaction.guild?.members.kick(userToKick as UserResolvable, kickReason);
            
            // Builds the response content
            let responseContent = utils.leafletInterpolater(getString(interaction.channelId, "kick", "successful_response", "head"), { user: `${userToKick.user.username}#${userToKick.user.discriminator}` });
            if (kickReason == "") 
            {
                responseContent += getString(interaction.channelId, "kick", "successful_response", "no_reason_provided_body")
                
            } else 
            {  
                responseContent += utils.leafletInterpolater(getString(interaction.channelId, "kick", "successful_response", "reason_provided_body"), { reason: kickReason })
            }
            
            // Send the successful kick response
            await interaction.reply({
                ephemeral: false,
                content: responseContent
            });

        }
        else{
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "user_not_found")
            });

        }

    }
}