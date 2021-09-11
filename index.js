const Discord = require("discord.js");
const { Client } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const { getGuildPlayer } = require("./functions/getGuildPlayer");
const { UpdateEmbed } = require("./functions/updateEmbed");

global.client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
client.commands = [];

const ACCEPTED_CHANNELS = [
  config["music-channel-id"],
  config["bot-testing-id"],
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
  for (const command of client.commands) {
    if (command.name === input || command.aliases.includes(input))
      return command;
  }
  return null;
}

client.on("message", async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  if (!ACCEPTED_CHANNELS.find((id) => id === message.channel.id)) {
    message.channel.send("Wrong channel");
    await message.delete();
    return;
  }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = getCommand(commandName);

  if (!command) {
    await message.delete();
    return;
  }

  try {
    command.execute(message, args);
  } catch (err) {
    console.error("command.execute error", err);
    await message.channel
      .send("Ошибка во время вызова команды :c")
      .then((msg) => msg.delete({ timeout: 2000 }));
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

client.login(config["discord-token"]);

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
