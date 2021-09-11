module.exports = {
  PlaySong,
};

const { UpdateEmbed, GetHistoryEmbed } = require("../functions/updateEmbed");
const { GetNextRelated } = require("../functions/getNextRelated");
const { GetSongByYTLink } = require("../functions/getSong");

const music_history = "804284091938766908";
const ytdl = require("ytdl-core");

async function PlaySong(url) {
  var stream = ytdl(url, options);
  stream.on("error", async (err) => {
    console.log("--=== YTDL ERROR ===--");
    console.log(err);
    onNextSong();
  });

  dispatcher = connection.play(stream);

  dispatcher.on("start", async () => {
    console.log("dispatcher::start");
    client.user.setActivity(`${CURRENT.title}`, { type: "PLAYING" });
    client.channels.cache
      .get(music_history)
      .send(await GetHistoryEmbed(CURRENT));
  });

  dispatcher.on("finish", async () => {
    console.log("dispatcher::finish");

    console.log(`repeat: ${repeat}`);
    if (repeat == true) PlaySong(CURRENT.url);

    onNextSong();
  });

  dispatcher.on("error", (error) => console.log(error));
}

async function onNextSong() {
  if (radio) {
    await GetNextRelated(CURRENT.url).then(
      async (nextSongLink) =>
        await GetSongByYTLink(nextSongLink).then((song) => {
          CURRENT = song;
          PlaySong(CURRENT.url);
        })
    );
  } else if (QUEUE.length == 0) {
    CURRENT = null;
    dispatcher.destroy();
    connection.disconnect();
    connection = undefined;
    client.user.setActivity("nothing", { type: "PLAYING" });
  } else {
    CURRENT = QUEUE.shift();
    PlaySong(CURRENT.url);
  }

  if (CURRENT) UpdateEmbed();
}
