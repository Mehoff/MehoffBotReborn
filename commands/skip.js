const ytdl = require('ytdl-core')
const Discord = require("discord.js");


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
	name: 'skip',
	description: 'Skips the song',
    execute(message, args){
        
        if(message.content)
            message.delete();

        if(!dispatcher || !connection)
            return;

        if(QUEUE.length > 0)
        {
            CURRENT = QUEUE.shift();
            PlaySong(CURRENT.url);
            UpdateEmbed();

        } else {
            dispatcher.destroy();
            connection.disconnect();
            CURRENT = null;
        }
        
    }
};