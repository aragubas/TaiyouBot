import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, Interaction, MessageEmbed } from "discord.js";
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
        
        // Valid response
        if (measuredReponse > 0)
        {
            await interaction.reply({
                ephemeral: false,
                content: utils.leafletInterpolater(getString(interaction.channelId, "ping", "pong", "pong"), { response_time: measuredReponse })
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