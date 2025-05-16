import { Client, Collection, GatewayIntentBits } from "discord.js";

let config: { token: string | undefined; clientId: string | undefined };
try {
  config = (await import("./config.json", { with: { type: "json" } }))!.default;
} catch {
  config = {
    token: Deno.env.get("DISCORD_TOKEN"),
    clientId: Deno.env.get("DISCORD_CLIENT_ID"),
  };
}

console.log(config);

if (!config.token || !config.clientId) {
  console.error(
    "Please provide a valid token and client ID in config.json or as environment variables.",
  );
  Deno.exit(1);
}

import path from "node:path";
import fs from "node:fs";
import { SlashCommandBuilder } from "discord.js";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, { data: SlashCommandBuilder, execute: (interaction: CommandInteraction) => Promise<void> }>;
  }
}

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();

const foldersPath = path.join(import.meta.dirname!, "commands");
const commandFolders = fs.readdirSync(foldersPath);
console.log(`Found ${commandFolders.length} command folders.`);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js") || file.endsWith(".ts")
  );
  console.log(
    `Found ${commandFiles.length} command files in folder "${folder}".`,
  );
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)).default;

    if ("data" in command && "execute" in command) {
      console.log(`registering command "${command.data.name}"`);
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}
console.log(`Loaded ${client.commands.size} commands.`);

const eventsPath = path.join(import.meta.dirname!, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) =>
  file.endsWith(".js") || file.endsWith(".ts")
);
console.log(`Found ${eventFiles.length} event files.`);

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = (await import(filePath)).default;
  console.log(`registering event "${event.name}"`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(config.token);
