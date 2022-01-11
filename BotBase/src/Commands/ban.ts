import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, DiscordAPIError, GuildMember, MessageActionRow, MessageButton, MessageEmbed, UserResolvable } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

// Bans specified user
async function doBan(client: Client, interaction: BaseCommandInteraction, userToBan: GuildMember, banReason: string): Promise<string>
{
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

    return responseContent
}


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
        
        // Check if user is not trying to run this interaction from DM
        if (interaction.channel == null || interaction.guild == null)
        {
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "dm_not_allowed")
            });
            return
        }

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

        // Check if bot has permission to ban members
        if (!interaction.guild.me?.permissions.has("BAN_MEMBERS")) 
        {  
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "self_ban_permission")
            });
            return
        }

        // If ban reason was provided, set ban reason to the provided ban reason
        if (interaction.options.data[1] != undefined) { banReason = interaction.options.data[1].value as string }
        
        // Get the user to ban
        const userToBan = interaction.guild?.members.resolve(userIDValue as string) as GuildMember;
        
        if (userToBan != null)
        {
            const confirmButtonID = randomUUID()
            const cancelButtonID = randomUUID()
            const interactionOwnerID = interaction.user.id;

            // Create the message row
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel(getString(interaction.channelId, "generic_buttons", "buttons", "yes"))
                        .setStyle("DANGER")
                        .setCustomId(confirmButtonID),
                    
                    new MessageButton()
                        .setLabel(getString(interaction.channelId, "generic_buttons", "buttons", "no"))
                        .setStyle("SECONDARY")
                        .setCustomId(cancelButtonID)
                            
                )
            
                        
            // Sends question message
            await interaction.reply({
                ephemeral: false,
                content: utils.leafletInterpolater(getString(interaction.channelId, "ban", "question", banReason != "" ? "ban_with_reason" : "ban"), {user: `${userToBan.user.username}#${userToBan.user.discriminator}`, reason: banReason}),
                components: [row]
            });

            // Listen to button presses
            var ceiraCollector = interaction.channel.createMessageComponentCollector({
                filter: (i => (i.customId == confirmButtonID || i.customId == cancelButtonID)), 
                time: 15000
            })

            // When button has been pressed
            ceiraCollector.on("collect", async (inter) => {       
                
                // Check if user is the owner of this interaction
                if (inter.user.id != interactionOwnerID)
                {
                    await inter.reply({
                        content: getString(interaction.channelId, "generic_errors", "errors", "interaction_access_denied"),
                        ephemeral: true
                    })
                    
                    return
                }
                
                // Disable button after the owner clicks on it
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                
                // Defer update
                await inter.deferUpdate()

                // Confirm; Ban user
                if (inter.customId == confirmButtonID)
                {                        
                    // Gets the response message
                    const returnContent = await doBan(client, interaction, userToBan, banReason);
                     
                    await inter.editReply({
                        content: returnContent,
                        components: [row]
                    })

                }
                else // Invalid or cancel operation
                {
                    // Sends "operation canceled" message
                    await inter.editReply({
                        content: getString(interaction.channelId, "generic_sucessful", "generic_sucessful", "operation_canceled"),
                        components: [row]
                    })                    
                }
                
                // Stops this collector
                ceiraCollector.stop()
            })
            


        }
        else { // User not found
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "user_not_found")
            });

        }

    }
}