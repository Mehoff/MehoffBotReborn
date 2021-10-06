module.exports = {
  getSong,
  getRelatedSong,
};

const Song = require("../modules/Song");
const API = require("simple-youtube-api");
const youtube = new API(process.env.YOUTUBE_API_KEY);
const ytdl = require("ytdl-core");
const fetch = require("node-fetch");

// // TODO:
// response = await fetch(`https://www.yt-download.org/api/button/mp3/${youtubeID}}`);
// text = await response.text();
// url = backupResult.split('<a href="')[1].split('" class="shadow-xl')[0];```
// Implement mp3 downloading from this web-site for age restricted videos
// https://github.com/fent/node-ytdl-core/issues/985 -> Steal impementation XD

async function getSong(message, args) {
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

    const info = await ytdl.getInfo(url);
    //https://github.com/fent/node-ytdl-core/issues/980#issuecomment-886211227 EPXOL

    const song = new Song(
      info.videoDetails.title,
      info.videoDetails.thumbnails[2].url,
      info.videoDetails.uploadDate,
      url,
      message.author
    );

    return song;
  } catch (err) {
    // Catch 410 error here, and make second request with cookies
    if (error.statusCode > 300) {
      const info = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            cookie: process.env.COOKIE,
            "x-user-data": process.env.YOUTUBE_ID_TOKEN,
          },
        },
      });

      if (info.videoDetails) {
        const song = new Song(
          info.videoDetails.title,
          info.videoDetails.thumbnails[2].url,
          info.videoDetails.uploadDate,
          url,
          message.author
        );

        return song;
      } else return null;
    }

    message.channel.send(
      "```Ошибка во время воспроизведения трека, возможные причины: частые запросы, либо видео имеет ограничение по возрасту (решение данной проблемы в разработке)```"
    );
    console.log("<!> GetSong()", err);
    return null;
  }
}

/**
 * Adds Song object to music player song queue array
 * @param {Song} song Song we use to search related
 * @param {string[]} history Array of songs radio already played as relayed, use it to exclude duplicates
 */
async function getRelatedSong(song, history) {
  const MAX_RESULTS = 10;
  const BASE = "https://www.youtube.com/watch?v=";
  const id = ytdl.getVideoID(song.url);
  const requestUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=${MAX_RESULTS}&key=${process.env.YOUTUBE_API_KEY}`;

  const response = await fetch(requestUrl).then((data) => data.json());
  if (response.error || !response.items.length > 0) {
    console.log("<!> getRelatedSong error", response.error);
    return null;
  }

  for (const item of response.items) {
    // get url from item.id.videoId
    if (
      !item.snippet ||
      history.find(async (song) => ytdl.getVideoID(song.url) == item.id.videoId)
    )
      continue;

    try {
      const videoUrl = `${BASE}${item.id.videoId}`;
      const info = await ytdl.getInfo(videoUrl);
      const song = new Song(
        info.videoDetails.title,
        info.videoDetails.thumbnails[2].url,
        info.videoDetails.uploadDate,
        videoUrl,
        client.user
      );

      return song;
    } catch (err) {
      if (err.statusCode > 300) {
        const info = await ytdl.getInfo(videoUrl, {
          requestOptions: {
            headers: {
              cookie: process.env.COOKIE,
            },
          },
        });
        const song = new Song(
          info.videoDetails.title,
          info.videoDetails.thumbnails[2].url,
          info.videoDetails.uploadDate,
          videoUrl,
          client.user
        );

        return song;
      } else return null;
    }
  }
  return null;
}
