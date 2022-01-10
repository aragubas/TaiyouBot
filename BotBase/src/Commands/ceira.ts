import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, Interaction, MessageEmbed } from "discord.js";
import Command from "../Command";
import { getString } from "../language";
import * as utils from "../utils"

export const ceira: Command = {
    name: "ceira",
    description: "Ceira sinas ceira sinas",
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        await interaction.reply({
            ephemeral: false,
            content: getString(interaction.channelId, "sinas", "ceira", "ceira")
        });

    }
}