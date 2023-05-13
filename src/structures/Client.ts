import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, GatewayIntentBits } from "discord.js";
import { CommandType } from "../typings/Command";
import { GlobOptions, glob } from 'glob';
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Events";
import FissureService from "../fissures/fissureService";


const globPromise = promisify(glob);
import fs from 'node:fs';
import path from 'node:path';
import { client } from "..";
export class DiscordClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    }



    start() {
        //this.getChannel();
        this.registerModules();
        const fissureService = new FissureService();
        fissureService.getFissures();
        this.login(process.env.botToken);
    }
    async getChannel() {
        const channel = await client.channels.fetch("1013907131902210133");
        const messages = await channel.fetch();
        console.log(messages);
    }

    async importFile(filePath: string){
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
      

    async registerModules(){
        this.application?.commands.set([]);
        const channel = client.channels.cache.get(process.env.channelId);
        console.log(channel);
        this.guilds.cache.get(process.env.guildId)?.commands.set([]);
        const foldersPath = path.join(__dirname, "..",'commands');
        const commandFolders = fs.readdirSync(foldersPath);
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        
        // Loop through all command folders
        for (const folder of commandFolders) {
            console.log("called outter loop")
          const commandsPath = path.join(foldersPath, folder);
          const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
          // Loop through all command files
          for (const file of commandFiles) {
            console.log("called inner loop")

            const filePath = path.join(commandsPath, file);
            console.log(filePath)
            const command: CommandType = await this.importFile(filePath);

            if (!command.name) return;
            this.commands.set(command.name, command);
            slashCommands.push(command);
        
          }
        }
        console.log(slashCommands)
        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            });
        });

        const eventsPath = path.join(__dirname, "..",'events');
        const eventFolder = fs.readdirSync(eventsPath);

        console.log(process.env.botToken);

        for (const event of eventFolder) {
            console.log(event);
            const eventPath = path.join(eventsPath, event);
            const commandEvent: Event<keyof ClientEvents> = await this.importFile(eventPath);
            this.on(commandEvent.name, commandEvent.run);
          }
    }
}