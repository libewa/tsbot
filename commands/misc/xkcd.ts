import { SlashCommandBuilder, CommandInteraction, Client } from "discord.js";
import * as cheerio from "cheerio";
import { EmbedBuilder } from "discord.js";

export default {
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("xkcd")
    .setDescription("Fetch XKCD comics")
    .addSubcommand(subcommand =>
      subcommand
      .setName("random")
      .setDescription("Return a random XKCD")
    )
    .addSubcommand(subcommand =>
      subcommand
      .setName("latest")
      .setDescription("Get the latest XKCD")
    )
    .addSubcommand(subcommand =>
      subcommand
      .setName("number")
      .setDescription("A comic with a specific number")
      .addIntegerOption(option =>
        option
          .setName("i")
          .setDescription("The index of the comic")
          .setRequired(true)
      )
    ),
  async execute(interaction: CommandInteraction) {
    let pageUrl = "";
    if (interaction.options.getSubcommand() === "random") {
      pageUrl = "https://c.xkcd.com/random/comic/";
    } else if (interaction.options.getSubcommand() === "latest") {
      pageUrl = "https://xkcd.com";
    } else if (interaction.options.getSubcommand() === "number") {
      pageUrl = `https://xkcd.com/${interaction.options.getInteger("i")}`;
    }
    const pageResponse = await fetch(pageUrl);
    if (!pageResponse.ok) {
      interaction.reply({ content: `xkcd.com returned a non-2xx status code. Most probably, comic number ${interaction.options.getInteger("i")} does not exist.`, ephemeral: true });
      return;
    }
    const $ = cheerio.load(await pageResponse.text());

    const permalink = $("#middleContainer > a:first").attr("href");
    const comicTitle = $("#ctitle").text();
    const imageUrl = $("#middleContainer > a:last").attr("href");

    const embed = new EmbedBuilder()
      .setTitle(comicTitle)
      .setURL(permalink)
      .setFooter({ text: "XKCD: A webcomic of romance, sarcasm, math and language.", iconURL: "https://www.explainxkcd.com/wiki/images/1/1f/xkcd_favicon.png" })
      .setImage(imageUrl);
    await interaction.reply({ embeds: [embed] });
  }
};
