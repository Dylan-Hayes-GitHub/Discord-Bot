import { Command } from "../../structures/Command";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandType } from "../../typings/Command";


const hostSquadCommand = {
	data: new SlashCommandBuilder()
	.setName('host')
	.setDescription('Host a fissure squad')
	.addStringOption(option =>
		option.setName('relic')
			.setDescription('Tier of relic')
			.setRequired(true)
			.addChoices(
				{ name: 'Lith', value: 'Lith' },
				{ name: 'Meso', value: 'Meso' },
				{ name: 'Neo', value: 'Neo' },
				{ name: 'Axi', value: 'Axi' },
				{ name: 'Requiem', value: 'Requiem' },
			))
		.addStringOption(option =>
			option.setName('members')
			.setDescription('Number of members in squad out of 4 I.E. 2/4')
			.setRequired(true)
			)
		.addStringOption(option =>
			option.setName('duration')
			.setDescription('Duration of run')
			.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('frames')
			.setDescription('Frames you would like for run I.E. Saryn, Mesa, Nova, Volt')
			.setRequired(false)
		),
	async execute(interaction: CommandInteraction) {
		return interaction.reply('Pong!');
	}
}
 
export default hostSquadCommand;

