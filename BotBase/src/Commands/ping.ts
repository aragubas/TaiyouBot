import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, Interaction, MessageActionRow, MessageButton, MessageCollector, MessageEmbed } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

export const ping: Command = {
    name: "ping",
    description: "Measures the response between discord and bot's server",
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        if (interaction.channel == null) { return }

        // Sends a ping message
        var message = await interaction.channel?.send(":ping_pong: Ping!")

        // Tries to get the ping message
        var pingMessage = interaction.channel.messages.cache.get(message.id);
        if (pingMessage == null) { console.log("Ceira Ariec"); return; }
        
        // Measure the time the ping message was sent compared to the current time
        var measuredReponse = Date.now() - pingMessage.createdTimestamp;
        var buttonID = randomUUID()

        const ceirabutton = new MessageButton()
        ceirabutton.setLabel("Enceirar")
        ceirabutton.setStyle("PRIMARY")
        ceirabutton.setCustomId(buttonID)

        const row = new MessageActionRow()
            .addComponents( ceirabutton )
        
        // Valid response
        if (measuredReponse > 0)
        {
            await interaction.reply({
                ephemeral: false,
                content: utils.leafletInterpolater(getString(interaction.channelId, "ping", "pong", "pong"), { response_time: measuredReponse }),
                components: [row]
            });            
            
        }else
        {
            await interaction.reply({
                ephemeral: false,
                content: getString(interaction.channelId, "ping", "pong", "error")
            });

        }

    }
}