const { getGuildPlayer } = require("../functions/getGuildPlayer.js");

module.exports = {
  name: "play",
  description: "Plays audiostream",
  aliases: ["p", "здфн", "з"],

  async execute(message, args) {
    const player = getGuildPlayer(message);
    player.parse(message, args);

    if (message.content) message.delete();
  },
};

// if (player) {
//   player.parse(message, args);
// } else {
//   let newPlayer = new MusicPlayer();
//   GUILDS.set(message.guild, newPlayer);
//   newPlayer.parse(message, args);
// }

// console.log(GUILDS);

// Почему-то не работает
// if(!message.member.voice.channel && !message.author.bot){
//     message.channel.send('Для начала зайди в голосовой канал 🙂').then(msg => msg.delete({timeout : 2000})); return;}

// channel = message.channel;
// connection = await message.member.voice.channel.join();

// GetSong(message, args).then(async (song) => {
//   QUEUE.push(song);

//   if (CURRENT == null) {
//     CURRENT = QUEUE.shift();
//     PlaySong(CURRENT.url);
//   }

//   UpdateEmbed();

//   message.delete();
// });
