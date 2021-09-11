const { getGuildPlayer } = require("../functions/getGuildPlayer");

module.exports = {
  name: "skip",
  description: "Skips the song",
  alliases: ["ылшз"],

  async execute(message, args) {
    const player = getGuildPlayer(message);
    player.skip();

    if (message.content) message.delete();
  },
};

// if(message.content)
//     message.delete();

// if(!dispatcher || !connection)
//     return;

//     if(radio){
//         await GetNextRelated(CURRENT.url)
//                     .then(async nextSongLink => await GetSongByYTLink(nextSongLink)
//                         .then(song => {
//                             CURRENT = song;
//                             PlaySong(CURRENT.url);
//                }));
//     }
//     else if(QUEUE.length == 0){

//         CURRENT = null;
//         dispatcher.destroy(); connection.disconnect(); connection = undefined;
//         client.user.setActivity('nothing', {type: 'PLAYING'})
//     }

//        else {
//            CURRENT = QUEUE.shift(); PlaySong(CURRENT.url);
//     }

//     if(CURRENT) UpdateEmbed();
