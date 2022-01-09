import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, Interaction, MessageEmbed } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

export const hello: Command = {
    name: "hello",
    description: "Says hello and what language this channel is currently in",
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        // Sends the generated UUID
        await interaction.reply({
            ephemeral: false,
            content: getString(interaction.channelId, "generic_strings", "strings", "hello")
        });

    }
}