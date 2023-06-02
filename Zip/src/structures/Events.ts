import { ClientEvents } from "discord.js";

export class Event<Key extends keyof ClientEvents> {
    public name: Key;
    public run: (...args: ClientEvents[Key]) => any;

    constructor(name: Key, run: (...args: ClientEvents[Key]) => any) {
        this.name = name;
        this.run = run;
    }
}