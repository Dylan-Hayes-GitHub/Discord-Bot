import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import hostingMessageOptions from "../../fissureMessage/fissureHostingMessage";
import { Squad, UserInSquad } from "../../fissures/interfaces";
import { getDatabase, ref, set } from "firebase/database";
import FissureService from "../../fissures/fissureService";
import { channel } from "diagnostics_channel";

const fissureService = new FissureService();
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
		const relic: string = interaction.options.get('relic')?.value as string;
		const mission: string = interaction.options.get('mission')?.value as string;
		const members: string = interaction.options.get('members')?.value as string;
		const duration: string = interaction.options.get('duration')?.value as string;
		const frames: string = interaction.options.get('frames')?.value as string;

		const hostInSquad: UserInSquad = {
			userId: interaction.user.id,
			userName: interaction.user.username
		}

		let hostingMessageId: string = "";
			if (frames === undefined) {
				return await interaction.reply(`Processing Host Request of ${relic} ${mission}, ${members}, ${duration}`).then((q) => {
					console.log("outer message id ", q.id)
				setTimeout(async () => {
					const message = await interaction.editReply({content: `${interaction.user.username} hosts ${relic} ${mission}, ${members}, ${duration}`, components: [hostingMessageOptions]})
					hostingMessageId = message.id
					const guestMembers: boolean = +members.charAt(0) > 1 ? true : false;

					const squad: Squad = {
						relic: relic,
						mission: mission,
						currentSquad: [hostInSquad],
						messageId: hostingMessageId,
						guestMembers: guestMembers,
						duration: duration,
						hostId: interaction.user.id,
						totalSquadMembers: +members.charAt(0),
						totalGuestMembers: +members.charAt(0) - 1
						}
					
					//add values to firebase
					const db = getDatabase();
					
					//add values to firebase
					await set(ref(db, 'squad/' + hostingMessageId), squad);

					const subscriptionsToPing = await fissureService.getUsersToPingFromFirebase([relic+mission]);

					interaction.channel.send(subscriptionsToPing[0]).then((message) => {
						setTimeout(() => {
							message.delete();
						}, 3000);
					});
				}, 3000);
				});			  
			} else if (frames !== undefined) {
				return await interaction.reply(`Processing Host Request of ${relic} ${mission}, ${members}, ${duration}, ${frames}`).then((q) => {
					console.log("outer message id ", q.id)
				setTimeout(async () => {
					const message = await interaction.editReply({content: `${interaction.user.username} hosts ${relic} ${mission}, ${members}, ${duration} | LF ${frames}`, components: [hostingMessageOptions]})
					hostingMessageId = message.id
					
					const guestMembers: boolean = +members.charAt(0) > 1 ? true : false;

				

					const squad: Squad = {
						relic: relic,
						mission: mission,
						currentSquad: [hostInSquad],
						messageId: hostingMessageId,
						guestMembers: guestMembers,
						duration: duration,
						totalSquadMembers: +members.charAt(0),
						frames: frames,
						hostId: interaction.user.id,
						totalGuestMembers: +members.charAt(0) - 1
						}
					
					//add values to firebase
					const db = getDatabase();
					
					//add values to firebase
					await set(ref(db, 'squad/' + hostingMessageId), squad);
					const subscriptionsToPing = await fissureService.getUsersToPingFromFirebase([relic+mission]);

					interaction.channel.send(subscriptionsToPing[0]).then((message) => {
						setTimeout(() => {
							message.delete();
						}, 3000);
					});
				}, 3000);
				});

			
			}
	}
}

export default hostSquadCommand;

