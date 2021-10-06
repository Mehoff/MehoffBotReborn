module.exports = {
  //UpdateEmbed,
  GetHistoryEmbed,
  GetEmbed,
};

const Discord = require("discord.js");
const MusicPlayer = require("../modules/musicPlayer");

/**
 * My function description
 * @param {MusicPlayer} musicPlayer
 * @returns {Discord.MessageEmbed}
 */
function GetEmbed(musicPlayer) {
  const embed = new Discord.MessageEmbed();
  let title = "";

  if (musicPlayer.paused) title += "⏸️ ";
  if (musicPlayer.repeat) title += "🔁 ";
  if (musicPlayer.radio) title += "📻 ";

  title += musicPlayer.current.title;

  embed.setTitle(`**__NOW:__** ${title}`);
  embed.setURL(musicPlayer.current.url);
  embed.setThumbnail(musicPlayer.current.thumbnail);
  embed.setTimestamp(musicPlayer.current.uploaded);

  const color = Math.floor(Math.random() * 16777215).toString(16);
  embed.setColor(color);

  const footer = `Текущий трек заказал: ${musicPlayer.current.author.username}`;

  embed.setFooter(
    footer,
    musicPlayer.current.author.displayAvatarURL({ format: "png", size: 64 })
  );

  if (musicPlayer.queue.length > 0) {
    for (const song of musicPlayer.queue) {
      const index = musicPlayer.queue.indexOf(song);

      let name = "";

      index === 0
        ? (name = `**__NEXT:__** ${song.title}`)
        : (name = `${index}. ${song.title}`);

      const value = `[Заказал ${song.author.username}](${song.url})`;

      embed.addField(name, value, false);
    }
  } else {
    embed.setDescription(
      "Очередь пуста 😢\nДобавь трек в очередь командой **!play** 😃\n\n⚠️ *Для корректной работы бота, видео не должно иметь ограничения по возрасту*"
    );
  }

  return embed;
}

function GetHistoryEmbed(song) {
  let historyembed = new Discord.MessageEmbed();

  historyembed.setTitle(`**${song.title}**`);
  historyembed.setURL(song.url);
  historyembed.setColor("#8b00ff");
  historyembed.setThumbnail(song.thumbnail);
  historyembed.setFooter(`Заказал ${song.author.username}`);

  return historyembed;
}
