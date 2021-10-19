const dotenv = require("dotenv");
const result = dotenv.config();
// if (result.error) {
//   throw result.error;
// }

const Discord = require("discord.js");
const { Client } = require("discord.js");
const fs = require("fs");
const { getGuildPlayer } = require("./functions/getGuildPlayer");

global.client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
client.commands = [];

const ACCEPTED_CHANNELS = [
  process.env.MUSIC_CHANNEL_ID,
  process.env.BOT_TESTING_ID,
];

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.push(command);
}

client.on("ready", () => {
  client.user.setActivity("nothing", { type: "PLAYING" });

  global.GUILDS = new Map();
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Node.js version: ${process.version}`);
});

function getCommand(input) {
  try {
    for (const command of client.commands) {
      if (command.name === input || command.aliases?.includes(input))
        return command;
    }
    return null;
  } catch (err) {
    return null;
  }
}

client.on("message", async (message) => {
  try {
    if (message.author.bot) return;

    if (
      !ACCEPTED_CHANNELS.find((id) => id === message.channel.id) &&
      message.content.startsWith(process.env.PREFIX)
    ) {
      const msg = await message.channel.send(
        "Wrong channel, go to *🎵music-channel*"
      );
      await msg.delete({ timeout: 2 * 1000 });
      await message.delete({ timeout: 2 * 1000 });
      return;
    }
    if (ACCEPTED_CHANNELS.find((id) => id === message.channel.id)) {
      const args = message.content
        .slice(process.env.PREFIX.length)
        .trim()
        .split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = getCommand(commandName);

      if (!command) {
        await message.delete({ timeout: 1 * 1000 });
      } else {
        command.execute(message, args);
      }
    }
  } catch (err) {
    await message.channel.send("Ошибка во время вызова команды").then((msg) => {
      msg.delete({ timeout: 2000 });
      message.delete({ timeout: 2000 });
    });
    return;
  }
});

client.on("messageReactionAdd", async (messageReaction, user) => {
  if (user.bot) return;

  const player = getGuildPlayer(messageReaction.message);

  player
    ? await player.onReaction(messageReaction, user)
    : console.log("NO PLAYER");
});

client.login(process.env.DISCORD_TOKEN);

//https://discord.js.org/#/docs/main/master/class/MessageEmbed

//  TODO:  \\

// GET Metainfo from ytdl for rich interface
// MongoDB for personal playlists and more
// .env support
// node-ytpl
// search {Название трека} {Кол-во результатов}
// playlist
// vk
// set to node js v14.16

//https://github.com/discordjs/discord.js/issues/5300
