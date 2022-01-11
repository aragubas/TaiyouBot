import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, Emoji, GuildMember, MessageActionRow, MessageButton, UserResolvable } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"


// Kicks specified user
async function doKick(client: Client, interaction: BaseCommandInteraction, userToKick: GuildMember, kickReason: string): Promise<string>
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
    
    // Returns the successful kick response
    return responseContent;
}

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

        // Check if user is not trying to run this interaction from DM
        if (interaction.channel == null)
        {
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "dm_not_allowed")
            });
            return
        }

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

        // If user has been found
        if (userToKick != null)
        {
            const row = new MessageActionRow()

            // Set up the confirm button
            const confirmButtonID = randomUUID()
            const confirmButton = new MessageButton()
            .setLabel(getString(interaction.channelId, "generic_buttons", "buttons", "yes"))
            .setStyle("PRIMARY")
            .setCustomId(confirmButtonID)
            
            // Set up the cancel button
            const cancelButtonID = randomUUID()
            
            // Set up cancel button
            const cancelButton = new MessageButton()
                .setLabel(getString(interaction.channelId, "generic_buttons", "buttons", "no"))
                .setStyle("DANGER")
                .setCustomId(cancelButtonID)
            
            // Add components
            row.addComponents(confirmButton, cancelButton)
            
            // Sends question message
            await interaction.reply({
                ephemeral: false,
                content: utils.leafletInterpolater(getString(interaction.channelId, "kick", "question", kickReason != "" ? "kick_with_reason" : "kick"), {user: `${userToKick.user.username}#${userToKick.user.discriminator}`, reason: kickReason}),
                components: [row]
            });

            // Listen to button presses
            var ceiraCollector = interaction.channel.createMessageComponentCollector({
                filter: (i => i.customId == confirmButtonID || i.customId == cancelButtonID && i.user.id == interaction.user.id), 
                time: 15000
            })

            // When button has been pressed
            ceiraCollector.on("collect", async (inter) => {
                // Disable button after someone clicks it
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await inter.deferUpdate()

                // Confirm; Kick user
                if (inter.customId == confirmButtonID)
                {                        
                    // Gets the response message
                    const returnContent = await doKick(client, interaction, userToKick, kickReason);
                    
                    inter.editReply({
                        content: returnContent,
                        components: [row]
                    })
                } 
                // Sends "operation canceled" message
                inter.editReply({
                    content: getString(interaction.channelId, "generic_sucessful", "generic_sucessful", "operation_canceled"),
                    components: [row]
                })
                
                // Stops this collector
                ceiraCollector.stop()
            })

            ceiraCollector.on("end", async (ceir) => {
                row.components[0].disabled = true;
            })

        }
        else{
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "user_not_found")
            });

        }

    }
}