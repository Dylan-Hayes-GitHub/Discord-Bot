import { Event } from "../structures/Events";
import { client } from "..";
import { CommandInteractionOptionResolver, ApplicationCommandDataResolvable, EmbedBuilder, User, TextChannel } from "discord.js";
import { ExtendedInteraction } from "../typings/Command";
import { get, getDatabase, ref, remove, update } from "firebase/database";
import { Squad, UserInSquad } from "../fissures/interfaces";

export default new Event("interactionCreate", async (interaction) => {

  const channel = interaction.channel as TextChannel;

  // Chat Input Commands
  if (interaction.isCommand()) {
    // Get the command from the client
    const command = client.commands.get(interaction.commandName);
    //const command = interaction.client.application.commands.fetch(interaction.commandName);


    if (!command && !interaction.isButton())
      return interaction.followUp("You have used a non existent command");

    if (command) {
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    }


  } else if (interaction.isButton()) {

    await interaction.deferUpdate();

    //use the inner message id to get the message TODO: make this a function
    if (interaction.customId === 'showSquad') {
      let embedToShow = new EmbedBuilder().setTitle("Current Squad Members \n");
      let membersInSquad = "";

      const hostingMessageId = interaction.message.id;

      //get the squad from firebase
      const db = getDatabase();
      const squadRef = ref(db, 'squad/' + hostingMessageId);
      const squadSnapshot = await get(squadRef);
      if (squadSnapshot.exists()) {
        const squad = squadSnapshot.val();
        squad.currentSquad.forEach((value: UserInSquad) => {
          membersInSquad += value.userName + "\n";
        });
        embedToShow.setDescription(membersInSquad);

        // return interaction.editReply('New content')
        // .then(console.log)
        // .catch(console.error);
        await interaction.editReply({ embeds: [embedToShow] }).then(() => {
          setTimeout(async () => {
            return await interaction.editReply({ embeds: [] });
          }, 3000);
        });
        // return await channel.messages.fetch(hostingMessageId).then(message => {
        //     message.edit({embeds: [embedToShow]})
        // }).then(() => {
        //     setTimeout(() => {

        //         interaction.update({ embeds: [] });
        //     }, 3000);
        // })

      } else {
        interaction.reply({ content: "Squad not found" }).then(() => {
          setTimeout(() => {
            interaction.deleteReply();
          }, 3000);
        });
      }

    } else if (interaction.customId === 'joinSquad') {

      //get the squad from firebase
      //check to see if the user is already in the squad
      //if they are do nothing
      //if they are not add them to the squad
      //update the hosting message

      const hostingMessageId = interaction.message.id;
      const db = getDatabase();
      const squadRef = ref(db, 'squad/' + hostingMessageId);
      const squadSnapshot = await get(squadRef);
      if (squadSnapshot.exists()) {
        const squad: Squad = squadSnapshot.val();
        const userInSquad = squad.currentSquad.find((user: UserInSquad) => user.userId === interaction.user.id);
        const author: UserInSquad = squad.currentSquad.find((user: UserInSquad) => user.userId === squad.hostId);

        if (userInSquad) {
          //interaction.reply({content: "You are already in the squad", ephemeral: true})
          if (squad.frames && squad.frames.length > 0) {
            return interaction.editReply({ content: `${author.userName} hosts ${squad.relic} ${squad.mission}, ${squad.totalSquadMembers}/4, ${squad.duration} | LF ${squad.frames}` })
          } else {
            return interaction.editReply({ content: `${author.userName} hosts ${squad.relic} ${squad.mission}, ${squad.totalSquadMembers}/4, ${squad.duration}` })
          }
        } else {

          //if the total squad count is equal to three delete the message and message all squad members
          if (squad.currentSquad.length === 3) {

            //add user who interacted to squad
            squad.currentSquad.push({ userId: interaction.user.id, userName: interaction.user.username });

            let embedToSendUsers = new EmbedBuilder();
            embedToSendUsers.setTitle(`${author.userName} squad is ready`);
            embedToSendUsers.setDescription(`${squad.relic} ${squad.mission} ${squad.duration} - Dont get 2035d`);

            let usersInSquad = `/invite ${author.userName}\n`;

            if (squad.guestMembers) {
              for (let i = 0; i < squad.totalGuestMembers; i++) {
                usersInSquad += `Guest user added by host`;
              }
            } else {
              squad.currentSquad.forEach((value: UserInSquad) => {
                usersInSquad += `/invite ${value.userName}\n`;
              });
            }

            embedToSendUsers.addFields({ name: "Users in squad", value: usersInSquad });
            //delete the message
            return await channel.messages.fetch(hostingMessageId).then(message => {
              message.delete();

              //message all squad members
              squad.currentSquad.forEach((value: UserInSquad) => {
                client.users.fetch(value.userId).then(user => {
                  user.send({ embeds: [embedToSendUsers] })
                });
              }
              );
            });
          } else {
            //add the user to the squad
            //update the record in firebase
            //update the hosting message
            const currentUsersInSquad = squad.currentSquad;
            currentUsersInSquad.push({ userId: interaction.user.id, userName: interaction.user.username });
            let newSquadMemberTotal = squad.totalSquadMembers + 1;
            await update(ref(db, 'squad/' + hostingMessageId), {
              currentSquad: currentUsersInSquad,
              totalSquadMembers: newSquadMemberTotal
            });
            //update the message

            if (squad.frames && squad.frames.length > 0) {
              return interaction.editReply({ content: `${author.userName} hosts ${squad.relic} ${squad.mission}, ${newSquadMemberTotal}/4, ${squad.duration} | LF ${squad.frames}` })
            } else {
              return interaction.editReply({ content: `${author.userName} hosts ${squad.relic} ${squad.mission}, ${newSquadMemberTotal}/4, ${squad.duration}` })
            }
          }
        }
      }
    } else if (interaction.customId === 'leaveSquad') {
      //get the squad from firebase
      //check to see if the user is already in the squad
      //if they are remove them from the squad
      //update the hosting message

      const hostingMessageId = interaction.message.id;
      const db = getDatabase();
      const squadRef = ref(db, 'squad/' + hostingMessageId);
      const squadSnapshot = await get(squadRef);
      if (squadSnapshot.exists()) {
        const squad: Squad = squadSnapshot.val();

        const userInSquad = squad.currentSquad.find((user: UserInSquad) => user.userId === interaction.user.id);
        const author: UserInSquad = squad.currentSquad.find((user: UserInSquad) => user.userId === squad.hostId);

        if (userInSquad) {
          //remove them from the current squad in squad variable

          const index = squad.currentSquad.indexOf(userInSquad);

          squad.currentSquad.splice(index, 1);

          //update the record in firebase
          //update the hosting message
          let newSquadMemberTotal = squad.totalSquadMembers - 1;
          await update(ref(db, 'squad/' + hostingMessageId), {
            currentSquad: squad.currentSquad,
            totalSquadMembers: newSquadMemberTotal
          });

          //update the message

          if (newSquadMemberTotal === 0) {

            //delete the record on firebase
            await remove(ref(db, 'squad/' + hostingMessageId));

            //delete the message
            return await interaction.deleteReply();
          } else if (squad.frames && squad.frames.length > 0) {
            return interaction.editReply({ content: `${author.userName} hosts ${squad.relic} ${squad.mission}, ${newSquadMemberTotal}/4, ${squad.duration} | LF ${squad.frames}` })
          } else {
            return interaction.editReply({ content: `${author.userName} hosts ${squad.relic} ${squad.mission}, ${newSquadMemberTotal}/4, ${squad.duration}` })
          }
        } else {
          if (squad.frames && squad.frames.length > 0) {
            return interaction.editReply({ content: `${author.userName} hosts ${squad.relic} ${squad.mission}, ${squad.totalSquadMembers}/4, ${squad.duration} | LF ${squad.frames}` })
          } else {
            return interaction.editReply({ content: `${author.userName} hosts ${squad.relic} ${squad.mission}, ${squad.totalSquadMembers}/4, ${squad.duration}` })
          }
        }
      }

    }
  }
});