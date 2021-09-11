const { UpdateEmbed } = require("../functions/updateEmbed.js");
const { getGuildPlayer } = require("../functions/getGuildPlayer");

module.exports = {
  name: "pause",
  description: "Pauses current song",
  aliases: ["зфгыу"],

  execute(message, args) {
    const player = getGuildPlayer(message);
    player.pause();
    if (message.content) message.delete();
  },
};
