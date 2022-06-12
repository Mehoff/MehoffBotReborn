const dotenv = require("dotenv");
dotenv.config();

const Discord = require("discord.js");
const { Client } = require("discord.js");
const fs = require("fs");
const { getGuildPlayer } = require("./functions/getGuildPlayer");

global.client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
client.commands = [];

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
    console.error(err);
    return null;
  }
}

client.on("message", async (message) => {
  try {
    if (message.author.bot) return;

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
