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

function PlaySong(url)
{
    var stream = ytdl(url, options);
    dispatcher = connection.play(stream);
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
            message.delete();

            message.channel.send('Неверная ссылка')
                .then(msg => {
                    msg.delete({timeout: 2000});
                })

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
        
        let song =
        {
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
            uploaded: info.videoDetails.uploadDate,
            url: url,
            author: message.author.username,
        };

        QUEUE.push(song);

        if(CURRENT == null){
        
        connection = await message.member.voice.channel.join();

        CURRENT = QUEUE.shift();
        PlaySong(CURRENT.url);

        
        dispatcher.on('start', () => {console.log('dispatcher::start')})

        dispatcher.on('finish', () => {

            if(repeat)
                PlaySong(CURRENT.url)

            else if(QUEUE.length == 0){ CURRENT = null; dispatcher.destroy(); connection.disconnect(); }
            
            else { CURRENT = QUEUE.shift(); PlaySong(CURRENT.url); }
         })

        dispatcher.on("error", console.error);

        }
        message.channel.send(GenerateNewEmbed(song))
        message.delete()
    }  
    
};