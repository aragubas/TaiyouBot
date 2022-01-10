import { BaseCommandInteraction, Client, Collection, Interaction, Message, MessageEmbed, TextBasedChannel, TextChannel } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import { leafletInterpolater } from "../utils";

export const clear: Command = {
    name: "clear",
    description: "Clear the last \"X\" ammount messages",
    options: [{
        name: "ammount",
        description: "Ammount of messages to delete (max of 100)",
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
        
        
        var { value: ammountToDeleteArg } = interaction.options.data[0]        
        var authorIdArg: any = null;
        
        // Optinal Argument
        if (interaction.options.data.length > 1)
        {
            authorIdArg = interaction.options.data[1].value;
        }
        
        if (ammountToDeleteArg == null) { return }
        var ammountToDelete: number = +ammountToDeleteArg
        
        if (ammountToDelete > 100) { ammountToDelete = 100; }

        var messages = await interaction.channel?.messages.fetch({
            limit: ammountToDelete,
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
        if (authorIdArg != null)
        {
            var filtredMessages: Collection<string, Message<boolean>> | undefined = messages?.filter(m => m.author.id == authorIdArg)
        
        }else // Delete all messages
        {
            var filtredMessages = messages
        }
        
        // if no message has been found
        if (filtredMessages == undefined)
        {
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "clear", "errors", "no_message_found")
            });        

            return;
        }
        
        // Gets the text channel to start bulk delete operation
        var textChannel: TextChannel = <TextChannel>interaction.channel
        
        // Wait until all messages has been deleted
        await textChannel.sendTyping();
        await textChannel.bulkDelete(filtredMessages, true);
        
        // Reply with success
        await interaction.reply({
            ephemeral: false,
            content: leafletInterpolater(getString(interaction.channelId, "clear", "sucessful_response", "success"), { count: ammountToDeleteArg })
        });        
        
    }
}