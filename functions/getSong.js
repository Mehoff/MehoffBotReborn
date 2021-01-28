module.exports = {
    GetSong
};


const API     = require('simple-youtube-api');
const youtube = new API(require('../config.json')['youtube-api-key'])
const ytdl    = require('ytdl-core')


async function GetSong(message, args)
{
    return new Promise(function(resolve, reject){
        var info = {}
        var song = {}
    
        try{
        if(!ytdl.validateURL(args[0]))
        {
            youtube.searchVideos(args.join(' '), 1)
                .then(result => {
                    info = ytdl.getInfo(result[0].url)
                        .then(info =>{
                            song =
                            {
                                title: info.videoDetails.title,
                                thumbnail: info.videoDetails.thumbnails[1].url,
                                uploaded: info.videoDetails.uploadDate,
                                url: result[0].url,
                                author: message.author.username,
                            };
    
                            resolve(song);
                        })
                })
        } else {
            var url = args[0];
            info = ytdl.getInfo(url)
                .then(info =>{
                    song =
                    {
                        title: info.videoDetails.title,
                        thumbnail: info.videoDetails.thumbnail.thumbnails[1].url,
                        uploaded: info.videoDetails.uploadDate,
                        url: url,
                        author: message.author.username,
                    };
    
                    resolve(song);
                })
        }
    }
    catch(e)
    {
        reject(e)
    }
    })

}