import { TextChannel } from "discord.js";
import FissureService from "../fissures/fissureService";
import { Event } from "../structures/Events";


export let channel: TextChannel | null = null;


export default new Event("ready", (client) => {
    const channelId = process.env.hostingChannel;
    channel = client.channels.cache.get(channelId) as TextChannel;
    
    const fissureService = new FissureService();
    fissureService.getFissures(channel);

});