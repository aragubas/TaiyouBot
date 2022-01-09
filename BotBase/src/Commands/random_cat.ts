import axios from "axios";
import { Client, BaseCommandInteraction, MessageEmbed } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

export const random_cat: Command = {
    name: "random_cat",
    description: "Shows a random image of a cat",
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        try
        {
            const response = await axios.get("https://aws.random.cat/meow")
            const responseEmbed = new MessageEmbed()
            
            const imageURL = response.data.file;

            if (!response.data.hasOwnProperty("file"))
            {
                await interaction.reply({
                    ephemeral: true,
                    content: getString(interaction.channelId, "random_cat", "errors", "api_error")
                })
                return;
            }

            responseEmbed.setImage(imageURL)
                .setTitle(getString(interaction.channelId, "random_cat", "embed_strings", "title"))
                .setFooter(imageURL)
    
            await interaction.reply({
                ephemeral: false,
                embeds: [responseEmbed]
            })
    
        }catch(error)
        {
            await interaction.reply({
                ephemeral: true,
                content: utils.leafletInterpolater(getString(interaction.channelId, "generic_errors", "errors", "internal_error"), { error: error } )
            })
            return;

        }

    }
}