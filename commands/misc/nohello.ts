import { CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("nohello")
    .setDescription("When someone makes a common mistake asking for help.")
    .setDescriptionLocalizations({
      de: "Wenn jemand einen der häufigen Fehler beim Fragen macht.",
    })
    .addUserOption((option) =>
      option.setName("target")
        .setDescription(
          "Der Nutzer, der auf dieses Thema aufmerksam gemacht werden soll.",
        )
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const target = options.getUser("target");
    const channel = await interaction.client.channels.fetch(interaction.channelId);
    if (!channel || !("send" in channel)) {
      await interaction.reply({
        content: "This command can only be used in text channels.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply(`Hello, ${target != null ? `<@${target.id}>!` : ""}
I have been informed that you have made one of the common mistakes when asking for help. That's nothing bad, this is just to help you avoid making these mistakes again and maybe getting shamed by less nice people.`);
    await channel.send(`## 1: Don't ask to ask. / No Hello
Asking to ask is a polite form we took from live talking. However, chatting is an asynchronous form of conversation, and as such, needs special ways of being polite.
Imagine you and the person who knows the answer to your question live in entirely different time zones and as a last action before you go to sleep, you want to ask a question in a help channel. However, only after a few minutes, you decide to sleep, as nobody responded. Only a few minutes later, someone on the other side of the world gets out of bed and checks their messages. They see a new message in #help, but as you only asked to ask, they can't help you, because you're asleep.
## 2: The XY problem.
The XY problem appears, when you do ask directly, but do not provide context.
Again, imagine you're asking a question, because you want to make a discord bot. Here are the differrent ways you could ask that question:
### The problematic way:
> How do I send a POST request to a URL in NodeJS?
This is problematic, as you did not specify what you want to do, and people cannot suggest better ways of doing it, e.g. using a library.
### The better way
> Hi, I want to make a discord bot in JavaScript, but do not know how to send requests to discord's API.
This is better, as it allows helpers to understand what's going on and suggest fitting alternatives.
### The best way
> Hi, I want to make a discord bot in JavaScript. I already have my base logic made, and know how to process the API return values, but I am struggling with sending the actual requests. This is my code:
> \`\`\`js
> //code here
> \`\`\`
> Thank you for helping me.
This is by far the best method, as, in addition to knowing the context, helpers know you actually tried to understand the topic, and that they aren't "spoonfeeding" you.`);
    await channel.send(`## Further reading
<https://www.dontasktoask.com/>: Other problems that could a rise if you ask to ask
<https://nohello.net/>: More on how not to ask to ask
<https://www.xyproblem.info/>: A site explaining the XY problem in more detail.`);
  },
};
