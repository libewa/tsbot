import { Collection, CommandInteraction, Events, MessageFlagsBitField } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
declare module "discord.js" {
  interface Client {
    commands: Collection<string, { data: SlashCommandBuilder, execute: (interaction: CommandInteraction) => Promise<void> }>;
  }
}

const MessageFlags = MessageFlagsBitField.Flags;

export default {
  name: Events.InteractionCreate,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
