const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
} = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "ping",
  description: "Check the bot's latency to Discord API and message response time.",
  cooldown: 5,
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  userPermissions: [],
  command: {
    enabled: true,
    aliases: ["latency"],
    usage: "ping",
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
    options: [],
  },

  async messageRun(message, args, data) {
    const startTime = Date.now();
    const msg = await message.channel.send("🏓 Pinging...");

    const endTime = Date.now();
    const messageLatency = endTime - startTime;
    const apiLatency = Math.round(message.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x00FF00) // This is green color for Itz_Fire
      .setTitle("Pong! 🏓")
      .setDescription(`Here are the ping results:`)
      .addFields(
        { name: "Message Latency", value: `${messageLatency}ms`, inline: true },
        { name: "API Latency", value: `${apiLatency}ms`, inline: true }
      )
      .setFooter({ text: "Ping test by your friendly bot!" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("refresh_ping")
        .setLabel("🔄 Refresh")
        .setStyle(ButtonStyle.Primary)
    );

    await msg.edit({ content: null, embeds: [embed], components: [row] });

    const filter = (interaction) =>
      interaction.customId === "refresh_ping" && interaction.user.id === message.author.id;

    const collector = msg.channel.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 15000,
    });

    collector.on("collect", async (interaction) => {
      const newStartTime = Date.now();
      await interaction.deferUpdate();

      const newEndTime = Date.now();
      const newMessageLatency = newEndTime - newStartTime;
      const newApiLatency = Math.round(message.client.ws.ping);

      const newEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle("Pong! 🏓 Refreshed")
        .setDescription(`Here are the updated ping results:`)
        .addFields(
          { name: "Message Latency", value: `${newMessageLatency}ms`, inline: true },
          { name: "API Latency", value: `${newApiLatency}ms`, inline: true }
        )
        .setFooter({ text: "Ping refreshed!" });

      await msg.edit({ embeds: [newEmbed], components: [row] });
    });

    collector.on("end", () => {
      row.components[0].setDisabled(true);
      msg.edit({ components: [row] });
    });
  },

  async interactionRun(interaction, data) {
    const startTime = Date.now();
    await interaction.reply("🏓 Pinging...");

    const endTime = Date.now();
    const messageLatency = endTime - startTime;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle("Pong! 🏓")
      .setDescription(`Here are the ping results:`)
      .addFields(
        { name: "Message Latency", value: `${messageLatency}ms`, inline: true },
        { name: "API Latency", value: `${apiLatency}ms`, inline: true }
      )
      .setFooter({ text: "Ping test by your friendly bot!" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("refresh_ping")
        .setLabel("🔄 Refresh")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.editReply({ content: null, embeds: [embed], components: [row] });

    const filter = (i) =>
      i.customId === "refresh_ping" && i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 15000,
    });

    collector.on("collect", async (i) => {
      const newStartTime = Date.now();
      await i.deferUpdate();

      const newEndTime = Date.now();
      const newMessageLatency = newEndTime - newStartTime;
      const newApiLatency = Math.round(interaction.client.ws.ping);

      const newEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle("Pong! 🏓 Refreshed")
        .setDescription(`Here are the updated ping results:`)
        .addFields(
          { name: "Message Latency", value: `${newMessageLatency}ms`, inline: true },
          { name: "API Latency", value: `${newApiLatency}ms`, inline: true }
        )
        .setFooter({ text: "Ping refreshed!" });

      await interaction.editReply({ embeds: [newEmbed], components: [row] });
    });

    collector.on("end", () => {
      row.components[0].setDisabled(true);
      interaction.editReply({ components: [row] });
    });
  },
};

/* Edited with ❤️ by trons_dc */
