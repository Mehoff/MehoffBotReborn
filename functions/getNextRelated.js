module.exports = {
    GetNextRelated
};

const fetch = require('node-fetch')
const ytdl = require('ytdl-core')
const ytKey = require('../config.json')['youtube-api-key'];
const maxResults = 5;

const baseYoutubeURL = 'https://www.youtube.com/watch?v='

async function GetNextRelated(url)
{
    return new Promise(function(resolve, reject){
        try
        {
            console.log(`GetNextRelated to: ${url}`)
            var id = ytdl.getVideoID(url);  
            var reqLink = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=${maxResults}&key=${ytKey}`;
        
            fetch(reqLink)
                .then(answer => answer.json())
                .then(res =>
                    {
                        if(res.error){console.log(res.error); return;}
                        
                        console.log(`reqLink: ${reqLink}`)
                        resolve( `${baseYoutubeURL}${res.items[1].id.videoId}`)
                    })
        
        }
        catch(e)
        {
            reject(e)
        }
    })

}