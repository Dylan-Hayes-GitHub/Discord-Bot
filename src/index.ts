// require("dotenv").config();
import dotenv from "dotenv";
import { DiscordClient } from "./structures/Client";
import { REST } from "discord.js";
dotenv.config();

export const client = new DiscordClient();
export const rest = new REST({ version: "10" }).setToken(process.env.botId);
client.start();
