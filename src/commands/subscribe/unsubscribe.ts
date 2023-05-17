import { SlashCommandBuilder } from "discord.js";
import { getDatabase, ref, push, get, remove } from "firebase/database";

const subscribeCommand = {
    data: new SlashCommandBuilder()
        .setName('unsubscribe')
        .setDescription('Unsubscribe from a fissure notification')
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
                )),
    async execute(interaction: any) {
        const relic = interaction.options.get('relic').value;
        const mission = interaction.options.get('mission').value;
        const userId = interaction.user.id;
        
        //save to firebase
        const relicPath = `subscriptions/${relic}${mission}`;

        //get database instance
        const db = getDatabase();

        //check if user is already subscribed
        //if so, return
        //if not, push to database
        const snapshot = await get(ref(db, relicPath));
        let subscribed = false;
        if(snapshot.exists()){
            const data = snapshot.val();
            const keys: string[] = Object.keys(data);
            const values: string[] = Object.values(data);

            for(let i = 0; i < values.length; i++){
                console.log(values[i])
                if(values[i] === userId){
                    //delete from database
                    const key = keys[i];
                    await remove(ref(db, `${relicPath}/${key}`));
                    return interaction.reply(`You have now unsubscribed from ${relic} ${mission} notifications`).then(() => {
                        setTimeout(async () => {
                            await interaction.deleteReply();
                        }, 3000);
                    });
                }

                // They arent subscribed to the relic and mission
                return interaction.reply(`You are not subscribed to ${relic} ${mission} notifications!`).then(() => {
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 3000);
                });
            }
            // if(values.includes(userId)){
            //     console.log("user already subscribed")

            // }
        } else {
            return interaction.reply(`You are not subscribed to ${relic} ${mission} notifications!`).then(() => {
                setTimeout(async () => {
                    await interaction.deleteReply();
                }, 3000);
            });
        }
    }
}

export default subscribeCommand;