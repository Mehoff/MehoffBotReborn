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
            const id = ytdl.getVideoID(url);  
            const reqLink = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=${maxResults}&key=${ytKey}`;
        
            try{
            fetch(reqLink)
                .then(answer => answer.json())
                .then(res =>
                    {
                        if(res.error){
                            console.log('GetNextRelated Error')
                            console.log(res.error); 
                            return;
                        }
                        
                        for(const item of res.items){
                            if(!item.snippet)
                                continue;
                            resolve(`${baseYoutubeURL}${item.id.videoId}`)
                        }
                    })
                }
                catch(error){
                    console.log('fetch error')
                    reject(error)
                }
        }
        catch(e)
        {
            reject(e)
        }
    })

}