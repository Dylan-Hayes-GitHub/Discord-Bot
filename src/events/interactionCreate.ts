import { Event } from "../structures/Events";
import { client } from "..";
import { CommandInteractionOptionResolver, ApplicationCommandDataResolvable } from "discord.js";
import { ExtendedInteraction } from "../typings/Command";
export default new Event("interactionCreate", async (interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
        // Get the command from the client
        const command = client.commands.get(interaction.commandName);
        console.log(command)
        //const command = interaction.client.application.commands.fetch(interaction.commandName);

        if (!command)
            return interaction.followUp("You have used a non existent command");

        try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}

    }
});