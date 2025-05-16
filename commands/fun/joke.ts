import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CommandInteractionOptionResolver } from "discord.js";

export default {
    enabled: true,
    data: new SlashCommandBuilder()
        .setName("joke")
        .setDescription("Get a random joke")
        .addStringOption(option =>
            option
                .setName("language")
                .setDescription("The language of the joke")
                .addChoices(
                    { name: 'Deutsch', value: 'de' },
                    { name: 'English', value: 'en' },
                    { name: 'Čeština', value: 'cz' },
                    { name: 'Español', value: 'es' },
                    { name: 'Français', value: 'fr' },
                    { name: 'Português', value: 'pt' }
                )
        ),
    async execute(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const lang = options.getString("language") || "en";
        const response = await fetch(`https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist&lang=${lang}`);
        const data = await response.json();

        if (data.type === "twopart") {
            await interaction.reply(`${data.setup}\n\n||${data.delivery}||`);
        } else {
            await interaction.reply(`${data.joke}`);
        }
    }
}