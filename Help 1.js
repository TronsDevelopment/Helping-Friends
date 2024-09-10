const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */

module.exports = {
  name: "ping",
  description: "Get the bot's ping",
  cooldown: 0,
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  userPermissions: [],
  command: {
    enabled: true,
    aliases: [],
    usage: "",
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: false,
    options: [],
  },

  async messageRun(message, args) {
    const response = await getPingData(message.client, message);
    const sentMessage = await message.safeReply(response);

    setTimeout(async () => {
      try {
        const expiredEmbed = new EmbedBuilder()
          .setAuthor({ name: `${message.client.user.username} | Ping Command Expired`, iconURL: message.client.user.displayAvatarURL() })
          .setColor(EMBED_COLORS.BOT_EMBED)
          .setDescription("This command has expired.\n➥〢 You can bring it again by using `!ping`")
          .setTimestamp();
    
        await sentMessage.edit({ embeds: [expiredEmbed] });
      } catch (error) {
        console.error("Failed to edit message:", error);
      }
    }, 10000);
  },

  async interactionRun(interaction) {
    const response = await getPingData(interaction.client, interaction);
    const sentMessage = await interaction.followUp(response);

    setTimeout(async () => {
      try {
        const expiredEmbed = new EmbedBuilder()
          .setAuthor({ name: `${interaction.client.user.username} | Ping Command Expired`, iconURL: interaction.client.user.displayAvatarURL() })
          .setColor(EMBED_COLORS.BOT_EMBED)
          .setDescription("This command has expired.\n➥〢 You can bring it again by using `/ping`")
          .setTimestamp();

        await sentMessage.edit({ embeds: [expiredEmbed] });
      } catch (error) {
        console.error("Failed to edit message:", error);
      }
    }, 10000);
  }
};

async function getPingData(client, message) {
  let circles = {
    good: '<:High:1267158758979538946>',
    okay: '<:Mid:1267158913162285057>',
    bad: '<:Low:1267158880903761930>',
  };

  const ws = client.ws.ping;
  const msgEdit = Date.now() - message.createdTimestamp;

  let days = Math.floor(client.uptime / 86400000);
  let hours = Math.floor(client.uptime / 3600000) % 24;
  let minutes = Math.floor(client.uptime / 60000) % 60;
  let seconds = Math.floor(client.uptime / 1000) % 60;

  const wsEmoji = ws <= 100 ? circles.good : ws <= 300 ? circles.okay : circles.bad;
  const msgEmoji = msgEdit <= 150 ? circles.good : msgEdit <= 400 ? circles.okay : circles.bad;

  const pingEmbed = new EmbedBuilder()
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTimestamp()
    .setFooter({ text: `Ping requested` })
    .addFields(
      {
        name: 'WebSocket Latency',
        value: `${wsEmoji} \`${ws}ms\``,
      },
      {
        name: 'API Latency',
        value: `${msgEmoji} \`${msgEdit}ms\``,
      },
      {
        name: `${client.user.username} Uptime`,
        value: `<:Timer:1267159000416518174> \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds}\``,
      }
    );

  return { embeds: [pingEmbed] };
}
