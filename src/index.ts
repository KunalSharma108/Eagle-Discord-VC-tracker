import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import { TOKEN } from "./config";
import fs from 'node:fs';
import path from 'node:path';

interface myClient extends Client {
  commands: Collection<String, any>;
}

export const client = new Client({
  intents:
    [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates
    ]
}) as myClient;

client.commands = new Collection();

const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);


for (const folder of commandFolders) {
  const commandsPath = path.join(folderPath, folder);
  const filePaths = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))


  for (const File of filePaths) {
    const filePath = path.join(commandsPath, File);
    const file = require(filePath);

    if ('data' in file && 'execute' in file) {
      client.commands.set(file.data.name, file);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.on(Events.InteractionCreate, async (interaction: any): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }
  
  try {
    await command.execute(interaction);
  } catch (error) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  }
});

// Catch synchronous errors not handled anywhere
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // You can decide to exit or not, but usually you just log it and keep going
});

// Catch async promise rejections that aren't handled
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log and keep the bot alive
});


client.once(Events.ClientReady, (clientReady: Client<true>): void => {
  console.log(`yo, ${clientReady.user.tag} is up and running`);
});

client.login(TOKEN);