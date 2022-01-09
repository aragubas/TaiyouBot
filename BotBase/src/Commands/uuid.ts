import { randomUUID } from "crypto";
import { BaseCommandInteraction, Client, Interaction, MessageEmbed } from "discord.js";
import Command from "../Command";
import * as utils from "../utils"

export const uuid: Command = {
    name: "uuid",
    description: "Generates a UUID (Universally Unique Identifier)",
    run: async (client: Client, interaction: BaseCommandInteraction) =>
    {
        // Sends the generated UUID
        await interaction.reply({
            ephemeral: true,
            content: `\`\`\`${randomUUID()}\`\`\``
        });

    }
}