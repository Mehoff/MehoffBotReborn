const Discord = require('discord.js');
const ytdl = require('ytdl-core')

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
    let url = args[0];

    console.log(url)

    if(!ytdl.validateURL(url))
        {
            message.delete();

            message.channel.send('Неверная ссылка')
                .then(msg => {
                    msg.delete({timeout: 2000});
                })

            return;
        }

        let info = {};
        let song = {};
        
        try
        {
            info = await ytdl.getInfo(url);
            song =
            {
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnail.thumbnails[1].url,
                uploaded: info.videoDetails.uploadDate,
                url: url,
                author: message.author.username,
            };
    
        }
        catch(error){
            message.channel.send('Ошибка библиотеки ytdl. Авторы заебали ей богу')
            song = 
            {
                title: 'undefined',
                thumbnail: 'undefined',
                uploaded: 'undefined',
                url: null,
                author: 'undefined',
            }
            console.error(error);
        }
        
        QUEUE.push(song);

        if(CURRENT == null)
        {
            connection = await message.member.voice.channel.join();
            CURRENT = QUEUE.shift();
            PlaySong(CURRENT.url);
        }
        UpdateEmbed();
        message.delete()
    }  
    
};