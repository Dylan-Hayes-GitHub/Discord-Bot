import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const hostingMessageOptions = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("joinSquad")
      .setLabel("Join Squad")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("leaveSquad")
      .setLabel("Leave Squad")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("showSquad")
      .setLabel("Show Squad Members")
      .setStyle(ButtonStyle.Primary)
  );    

  export default hostingMessageOptions;