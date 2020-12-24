const Discord = require('discord.js');
const ytdl = require('ytdl-core')
const API  = require('simple-youtube-api');
const youtube = new API(require('../config.json')['youtube-api-key'])


async function UpdateEmbed()
{
    let newEmbed = new Discord.MessageEmbed;
 
    newEmbed.setTitle(CURRENT.title)
    newEmbed.setURL(CURRENT.url)
    newEmbed.setColor('#8b00ff')
    newEmbed.setThumbnail(CURRENT.thumbnail)
    newEmbed.setFooter(`Текущий заказал: ${CURRENT.author}`)

    // Потому что embed вмещает в себя не больше 25 field`ов
    for(var i = 0; i < 25; i++)
    {
        if(QUEUE[i])
            newEmbed.addField(QUEUE[i].title, `Заказал ${QUEUE[i].author}`)
        else break;
    }
    
    if(embed)
    {
        embed.edit(newEmbed)    
    } else {
        embed = await channel.send(newEmbed);
        embed.react('⏯️')
            .then(embed.react('⏭️'))
            .then(embed.react('🔀'))
            .then(embed.react('🔁'))
    }
}

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
                                thumbnail: info.videoDetails.thumbnail.thumbnails[1].url,
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

function PlaySong(url)
{
    var stream = ytdl(url, options);
    dispatcher = connection.play(stream);
            
    dispatcher.on('start', () => {
        console.log('dispatcher::start')
    })

    dispatcher.on('finish', () => {

        console.log('dispatcher::finish');
    
        if(repeat)
            PlaySong(CURRENT.url)

        else if(QUEUE.length == 0){ CURRENT = null; dispatcher.destroy(); connection.disconnect(); embed.delete(); embed = null;}
        
        else { CURRENT = QUEUE.shift(); PlaySong(CURRENT.url);}

        if(CURRENT)
            UpdateEmbed();
     })

    dispatcher.on("error", (error) => console.log(error));
}


module.exports = {

    name: 'play',
    description: 'Plays audiostream',

    async execute(message, args) {
    
    channel = message.channel;
    connection = await message.member.voice.channel.join();
    
    GetSong(message, args)
        .then(song =>{

        QUEUE.push(song);

        if(CURRENT == null) 
            {
                CURRENT = QUEUE.shift();
                PlaySong(CURRENT.url);
            }

            UpdateEmbed();
            message.delete()
        })
    }  
    
};