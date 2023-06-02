import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const predictCommand = {
    data: new SlashCommandBuilder()
    .setName('predict')
    .setDescription('Work In progress to be revealed'),
    async execute(interaction: CommandInteraction){
        return interaction.reply('This feature is current a work in progress, once it is completed it will be available to clan members only').then(msg => {
            setTimeout(() => {
                msg.delete();
            }, 5000);
        })
    }
}

export default predictCommand;