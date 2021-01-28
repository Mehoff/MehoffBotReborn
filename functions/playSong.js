module.exports = {
    PlaySong
};

const { UpdateEmbed } = require('../functions/updateEmbed');

const ytdl = require('ytdl-core')


function PlaySong(url)
{

    var stream = ytdl(url, options);
    dispatcher = connection.play(stream);


    dispatcher.on('start', () => {
        console.log('dispatcher::start')
        client.user.setActivity(`${CURRENT.title}`, {type: 'PLAYING'})
    })

    dispatcher.on('finish', () => {

        console.log('dispatcher::finish');
    
        if(repeat)
            PlaySong(CURRENT.url)

        else if(QUEUE.length == 0)
        {
            CURRENT = null; 
            dispatcher.destroy();
            connection.disconnect();
            connection = null;
            client.user.setActivity('nothing', {type: 'PLAYING'})
        }
        
        else { CURRENT = QUEUE.shift(); PlaySong(CURRENT.url);}

        if(CURRENT)
            UpdateEmbed();
     })

    dispatcher.on("error", (error) => console.log(error));
}
