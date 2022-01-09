import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, Interaction, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

export const reverse_text: Command = {
    name: "reverse_text",
    description: "Reverse text",
    options: [{
        name: "text",
        description: "Text to be reversed",
        type: "STRING",
        required: true
    }, 
    {
        name: "public",
        description: "Reply publicly, so everyone can see the reverse text",
        type: "BOOLEAN",
        required: false
    }], 
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        // Input Text Argument
        const { value: inputText } = interaction.options.data[0]
        let publicReply = true
 
        if (interaction.options.data[1] != null)
        {
            publicReply = !interaction.options.data[1].value as boolean
        }


        // Check if input is grather than 3 characters and not null
        if (inputText == null || inputText.toString().length < 3)
        {
            await interaction.reply({
                ephemeral: true,
                content: getString(interaction.channelId, "reverse_text", "errors", "text_too_small")
            });
            return
            
        }

        // Sends the reversed message
        await interaction.reply({
            content: inputText?.toString().split("").reverse().join(""),
            ephemeral: publicReply
        });

    }
}