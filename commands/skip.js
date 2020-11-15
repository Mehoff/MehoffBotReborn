const ytdl = require('ytdl-core')
const Discord = require("discord.js");

const options = 
{
    filter: "audioonly",
    dlChunkSize: 0,
    highWaterMark: 1<<25,
}

function PlaySong(url)
{
    var stream = ytdl(url, options);
    dispatcher = connection.play(stream);
}

module.exports = {
	name: 'skip',
	description: 'Skips the song',
    execute(message, args){
        
        message.delete();

        if(!dispatcher || !connection)
            return;

        if(QUEUE.length > 0)
        {
            CURRENT = QUEUE.shift();
            PlaySong(CURRENT.url);
        } else {
            dispatcher.destroy();
            connection.disconnect();
            CURRENT = null;
        }
    }
};