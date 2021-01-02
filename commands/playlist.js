const ytpl = require('ytpl')
const config = require('../config.json');
const SimpleYoutubeApi = require('simple-youtube-api')
const syapi = new SimpleYoutubeApi(config['youtube-api-key'])


module.exports = 
{
    name: 'playlist',
    description: 'Gets items of youtube playlist',

    async execute(message, args)
    {
        ytpl.getPlaylistID(args[0])
            .then(id => {
                syapi.getPlaylistByID(id)
                    .then(playlist =>{
                            playlist.getVideos()
                                .then(videos =>{
                                    for(const video of videos)
                                    {
                                        if(CURRENT)
                                        {
                                            //Create Song Object
                                            QUEUE.push()
                                        } else {
                                            // PlayCurrent
                                        }
                                        //console.log(video.url)
                                        //setTimeout(client.commands.get('play').execute(message, video.url), 500)
                                    }
                                    //UpdateEmbed()
                                })
                        })
                })
    }
}



                // ytpl bug <!> https://github.com/TimeForANinja/node-ytpl/issues/84 
                // ytpl(id)
                //     .then(data => {console.log(data)})