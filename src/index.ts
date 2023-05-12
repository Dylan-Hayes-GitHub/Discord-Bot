// require("dotenv").config();
import dotenv from "dotenv";
import { DiscordClient } from "./structures/Client";
dotenv.config();

export const client = new DiscordClient();
client.start();
