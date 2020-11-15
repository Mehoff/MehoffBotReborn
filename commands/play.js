const Discord = require('discord.js');
const ytdl = require('ytdl-core')

function GenerateNewEmbed(song)
{

    let embed = new Discord.MessageEmbed;
    embed.setTitle(song.title)
    embed.setURL(song.url)
    embed.setColor('#8b00ff')
    embed.setImage(song.thumbnail)
    embed.setFooter(`Заказал: ${song.author}`)

    return embed;
}

const options = 
{
    filter: "audioonly",
    dlChunkSize: 0,
    highWaterMark: 1<<25,
}

module.exports = {

    name: 'play',
    description: 'Plays audiostream',

    async execute(message, args) {
    if(!ytdl.validateURL(args[0]))
        {
            message.channel.send('Некорректный запрос, либо вы не подключены к голосовому каналу');
            return;
        }

        let info = {};
        let url = args[0];
        
        try{
            info = await ytdl.getInfo(args[0]);
        }
        catch(error){
            console.error(error);
        }
        
        var song =
        {
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
            uploaded: info.videoDetails.uploadDate,
            url: url,
            author: message.author.username,
        };

        QUEUE.push(song)

        if(CURRENT == null)
        {
        connection = await message.member.voice.channel.join();
        var stream = ytdl(song.url, options);
        dispatcher = connection.play(stream);

        CURRENT = song;
        QUEUE.shift();

        dispatcher.on("finish", () =>
         {
            console.log('dispatcher::finish');

            CURRENT = null;
            if(QUEUE.length == 0)
                connection.disconnect();
            else
            {
                CURRENT = QUEUE[0];
                QUEUE.shift();
                
                var stream = ytdl(CURRENT.url, options);
                dispatcher = connection.play(stream);
            }
         })
        }
        message.channel.send(GenerateNewEmbed(song))
        message.delete()
    }  
    
};