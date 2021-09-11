const Message = require("discord.js");
const MusicPlayer = require("../modules/musicPlayer");

/**
 * Returns (and possibly creates) music player for specific guild (every guild should have only one)
 * @param {Message} message
 * @returns {MusicPlayer}
 */
const getGuildPlayer = (message) => {
  const player = GUILDS.get(message.guild);

  if (player) {
    return player;
  } else {
    let newPlayer = new MusicPlayer();
    GUILDS.set(message.guild, newPlayer);
    return GUILDS.get(message.guild);
  }
};

module.exports = {
  getGuildPlayer,
};
