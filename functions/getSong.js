module.exports = {
  GetSong,
  GetSongByYTLink,
};

const Song = require("../modules/Song");

const API = require("simple-youtube-api");
const youtube = new API(require("../config.json")["youtube-api-key"]);
const ytdl = require("ytdl-core");
const config = require("../config.json");

// // TODO:
// response = await fetch(`https://www.yt-download.org/api/button/mp3/${youtubeID}}`);
// text = await response.text();
// url = backupResult.split('<a href="')[1].split('" class="shadow-xl')[0];```
// Implement mp3 downloading from this web-site for age restricted videos
// https://github.com/fent/node-ytdl-core/issues/985 -> Steal impementation XD

async function GetSong(message, args) {
  const input = args[0];
  let url;

  try {
    ytdl.validateURL(input)
      ? (url = input)
      : (url = await youtube
          .searchVideos(args.join(" ", 1))
          .then((videos) => (url = videos[0].url)));

    if (!url) {
      message.channel.send("Видео не найдено");
      return;
    }

    const token = String.raw`QUFFLUhqbDJTYTlIWVR1ZlJsTWdqbjY2VFJSbENTMzc2QXw\u003d`;
    console.log(token);

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          cookie: config["cookie"],
        },
      },
    });

    const song = new Song(
      info.videoDetails.title,
      //info.videoDetails.thumbnails[1].url,
      info.videoDetails.thumbnails[2].url,
      info.videoDetails.uploadDate,
      url,
      message.author
    );

    return song;
  } catch (err) {
    message.channel.send(
      "```Ошибка во время воспроизведения трека, возможные причины: частые запросы, либо видео имеет ограничение по возрасту (решение данной проблемы в разработке)```"
    );
    console.log("<!> GetSong()", err);
    return null;
  }
}

async function GetSongByYTLink(link) {
  return new Promise(function (resolve, reject) {
    var info = {};
    var song = {};
    try {
      if (!ytdl.validateURL(link)) reject();

      info = ytdl.getInfo(link).then((res) => {
        new Song(
          res.videoDetails.title,
          res.videoDetails.thumbnails[1].url,
          res.videoDetails.uploadDate,
          link,
          "Нет автора"
        );

        resolve(song);
      });
    } catch (e) {
      reject(e);
    }
  });
}
