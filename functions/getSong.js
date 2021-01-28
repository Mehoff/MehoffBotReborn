module.exports = {
    GetSong, GetSongByYTLink
};


const API     = require('simple-youtube-api');
const youtube = new API(require('../config.json')['youtube-api-key'])
const ytdl    = require('ytdl-core')


async function GetSong(message, args)
{
    return new Promise(function(resolve, reject){
        var info = {}
        var song = {}
    
        try
        {
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
                        thumbnail: info.videoDetails.thumbnails[1].url,
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

async function GetSongByYTLink(link)
{
    return new Promise(function(resolve, reject){

        var info = {}
        var song = {}
    try
    {

        console.log(`GetSongByYTLink: ${link}`)
        if(!ytdl.validateURL(link))
            reject();

        info = ytdl.getInfo(link)
            .then(res => {
                song = {
                    title: res.videoDetails.title,
                    thumbnail: res.videoDetails.thumbnails[1].url,
                    uploaded: res.videoDetails.uploadDate,
                    url: link,
                    author: 'Радио',
                };


                console.log(song);
                resolve(song);
    })
    }
    catch(e)
    {
        reject(e)
    }
})
}