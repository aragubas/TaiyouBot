import { BaseCommandInteraction, Client, Collection, Interaction, Message, MessageEmbed, TextBasedChannel, TextChannel } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import { leafletInterpolater } from "../utils";

export const clear: Command = {
    name: "clear",
    description: "Clear the last \"X\" amount messages",
    options: [{
        name: "amount",
        description: "Amount of messages to delete (max of 100)",
        type: "INTEGER",
        required: true
    },
    {
        name: "user",
        description: "User to delete messages",
        type: "USER",
        required: false
    }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        // Check if the command is being run on a DM
        if (interaction.memberPermissions == null)
        {
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "dm_not_allowed")
            });

            return;
        }

        // Check if user has permission to manage messages
        if (!interaction.memberPermissions.has("MANAGE_MESSAGES"))
        {
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "manage_messages_permission")
            });
            
            return;
        } 
        
        
        var { value: amountToDeleteArg } = interaction.options.data[0]        
        var authorIdArg: any = null;
        
        // Optinal Argument
        if (interaction.options.data.length > 1)
        {
            authorIdArg = interaction.options.data[1].value;
        }
        
        if (amountToDeleteArg == null) { return }
        var amountToDelete: number = +amountToDeleteArg

        if (amountToDelete > 100) { amountToDelete = 100; }
        var searchLimit = amountToDelete

        if (authorIdArg != null) { searchLimit = 100; }
 
        var messages = await interaction.channel?.messages.fetch({
            limit: searchLimit,
        })
        
        // Check if channel type is valid
        if (typeof interaction.channel === typeof TextChannel) 
        {  
            console.log(typeof interaction.channel)
            console.log(typeof TextChannel)
            
            // Replies with invalid channel response
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "invalid_channel")
            });        

            return;
        }
 
        // Delete message from user
        var filtredMessages = messages

        // Gets the text channel to start bulk delete operation
        var textChannel: TextChannel = <TextChannel>interaction.channel

        if (authorIdArg != null)
        {
            // Get all last 100 messages from author
            var userMessages: Collection<string, Message<boolean>> | undefined = messages?.filter(m => m.author.id == authorIdArg)
            
            if (userMessages != undefined)
            {
                var messagesToDelete = new Array;
                
                // If the amount of messages to delete is the same as the total amount of messages
                if (amountToDelete == userMessages.size)
                {
                    // Add all messages to messagesToDelete list
                    userMessages.forEach(msg => {
                        messagesToDelete.push(msg)
                    });
                    
                }else
                {
                    // Get the last X messages from user
                    for(let i = 0; i < userMessages?.size - amountToDelete; i++)
                    {
                        messagesToDelete.push(interaction.channel?.messages.cache.get(<string>userMessages.keyAt(i)))
                    }
                }
                
                // If no messages has been found
                if (messagesToDelete.length == 0)
                {
                    await interaction.reply({
                        ephemeral: true,
                        content: getString(interaction.channelId, "generic_errors", "errors", "no_message_found")
                    });        
        
                    return;        
                }

                // Wait until all messages has been deleted
                await textChannel.sendTyping();
                await textChannel.bulkDelete(messagesToDelete, true);
 
                // Reply with success
                await interaction.reply({
                    ephemeral: false,
                    content: leafletInterpolater(getString(interaction.channelId, "clear", "sucessful_response", "success_user_delete"), { count: messagesToDelete.length, user: `<@${authorIdArg}>` })
                });        
                
                return
            }
        }
        
        // if no message has been found
        if (filtredMessages == undefined)
        {
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "generic_errors", "errors", "no_message_found")
            });        

            return;
        }
                
        // Wait until all messages has been deleted
        await textChannel.sendTyping();
        await textChannel.bulkDelete(filtredMessages, true);

        // Reply with success
        await interaction.reply({
            ephemeral: false,
            content: leafletInterpolater(getString(interaction.channelId, "clear", "sucessful_response", "success"), { count: filtredMessages.size })
        });        
        
    }
}