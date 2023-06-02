import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, CommandInteraction, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Events";
import app from "../firebase/firebase";

import fs from 'node:fs';
import path from 'node:path';
import { client, rest } from "..";
import { startServer } from "../express/express";
export class DiscordClient extends Client {
  let commands: Collection<string, any> = new Collection();

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
  }



  start() {
    this.registerModules();
    this.login(process.env.botToken);

    //start express server
    startServer();

    //initialize firebase
    const initialLizeApp = app;
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set([]);
      this.guilds.cache.get(guildId)?.commands.set(commands);
      console.log(`Registering commands to ${guildId}`);
    } else {
      this.application?.commands.set([]);

      this.application?.commands.set(commands);
      console.log("Registering global commands");
    }
  }


  async registerModules() {



    this.application?.commands.set([]);
    this.guilds.cache.get(process.env.guildId)?.commands.set([]);

    const foldersPath = path.join(__dirname, "..", 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    const slashCommands: ApplicationCommandDataResolvable[] = [];

    console.log(foldersPath)
    // Loop through all command folders
    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

      // Loop through all command files
      for (const file of commandFiles) {

        const filePath = path.join(commandsPath, file);
        const command: any = await this.importFile(filePath);

        this.commands.set(command.data.name, command);
        slashCommands.push(command.data);
      }
    }


    this.guilds.cache.get(process.env.guildId)?.commands.set([]);

    this.application?.commands.set(slashCommands);


    (async () => {
      try {
        console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data: any = await rest.put(
          Routes.applicationGuildCommands(process.env.botId, process.env.guildId),
          { body: slashCommands },
        );

      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
      }
    })();

    const eventsPath = path.join(__dirname, "..", 'events');
    const eventFolder = fs.readdirSync(eventsPath);


    for (const event of eventFolder) {
      const eventPath = path.join(eventsPath, event);
      const commandEvent: Event<keyof ClientEvents> = await this.importFile(eventPath);
      if (!commandEvent.name || !commandEvent.run) continue;
      this.on(commandEvent.name, commandEvent.run);
    }
  }
}