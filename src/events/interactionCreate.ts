import { Event } from "../structures/Events";
import { client } from "..";
import { CommandInteractionOptionResolver, ApplicationCommandDataResolvable } from "discord.js";
import { ExtendedInteraction } from "../typings/Command";
export default new Event("interactionCreate", async (interaction) => {
    


    // Chat Input Commands
    if (interaction.isCommand()) {
        // Get the command from the client
        const command = client.commands.get(interaction.commandName);
        //const command = interaction.client.application.commands.fetch(interaction.commandName);


        if (!command && !interaction.isButton())
            return interaction.followUp("You have used a non existent command");

        if(command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isButton()) {
            // try {
            //     if (interaction.customId === "joinSquad") {
            //         await interaction.reply({content: "You have joined the squad", ephemeral: true})
            //     }
            // } catch (error) {
            //     console.error(`Error executing ${interaction.customId}`);
            //     console.error(error);
            // }
        }


    }

    if(interaction.isButton()) {
        console.log('button id ', interaction.customId)
        console.log('button id ', interaction)
        //use the inner message id to get the message TODO: make this a function
        return interaction.reply("Button Pressed");

    }

});