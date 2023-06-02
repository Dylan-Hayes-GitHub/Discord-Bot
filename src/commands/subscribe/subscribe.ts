import { SlashCommandBuilder } from "discord.js";
import { getDatabase, ref, push, get } from "firebase/database";

const subscribeCommand = {
  data: new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Subscribe to fissure notifications')
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
    const storePath = `subscriptions/${relic}${mission}`;

    //get database instance
    const db = getDatabase();

    //check if user is already subscribed
    //if so, return
    //if not, push to database
    const snapshot = await get(ref(db, storePath));
    let subscribed = false;
    if (snapshot.exists()) {
      const data = snapshot.val();
      const values: string[] = Object.values(data);

      for (let i = 0; i < values.length; i++) {
        if (values[i] === userId) {
          subscribed = true;
          return interaction.reply(`You are already subscribed to ${relic} ${mission} notifications!`).then(() => {
            setTimeout(async () => {
              await interaction.deleteReply();
            }, 3000);
          });
        }
      }

      if(!subscribed){
        await push(ref(db, storePath), userId);
        return interaction.reply(`You have subscribed to ${relic} ${mission} notifications!`).then(() => {
          setTimeout(async () => {
            await interaction.deleteReply();
          }, 3000);
        });
      }
      // if(values.includes(userId)){
      //     console.log("user already subscribed")

      // }
    }
    else {
      await push(ref(db, storePath), userId);
      return interaction.reply(`You have subscribed to ${relic} ${mission} notifications!`).then(() => {
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 3000);
      });
    }
  }
}

export default subscribeCommand;