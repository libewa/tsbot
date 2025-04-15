import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
    enabled: true,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Reply Pong!"),
    async execute(interaction: CommandInteraction) {
        const sent = await interaction.reply(`Pong! 🏓\nMeasuring RTL...`);
	interaction.editReply(`Pong! 🏓\nWebsocket heartbeat: ${interaction.client.ws.ping}ms\nRTL: ${sent.createdTimestamp - interaction.createdTimestamp}ms`)
    }
}
