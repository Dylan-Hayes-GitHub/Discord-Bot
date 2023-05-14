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
			option.setName('mission')
			.setDescription('Mission type')
			.setRequired(true)
			.addChoices(
				{ name: 'Survival', value: 'Survival' },
				{ name: 'Interception', value: 'Interception' },
				{ name: 'Disruption', value: 'Disruption' },
				{ name: 'Excavation', value: 'Excavation' },
			))
		.addStringOption(option =>
			option.setName('members')
			.setDescription('Number of members in squad out of 4 I.E. 2/4')
			.setRequired(true)
			.addChoices(
				{ name: '1/4', value: '1/4' },
				{ name: '2/4', value: '2/4' },
				{ name: '3/4', value: '3/4' },
			))
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
		const relic = interaction.options.get('relic').value;
		const mission = interaction.options.get('mission').value;
		const members = interaction.options.get('members').value;
		const duration = interaction.options.get('duration').value;
		const frames = interaction.options.get('frames')?.value;
		
		console.log(relic, members, duration, frames);
		if(frames === undefined){
			return interaction.reply(`Processing Host Request of ${relic} ${mission}, ${members}, ${duration}`).then(() => {
				setTimeout(() => {
				  interaction.deleteReply();
				}, 3000);
			  });
			}else if(frames !== undefined){
				return interaction.reply(`Processing Host Request of ${relic} ${mission}, ${members}, ${duration}, ${frames}`).then(() => {
				setTimeout(() => {
					interaction.deleteReply();
				}, 3000);
				});
			}
		
	}
}
 
export default hostSquadCommand;

