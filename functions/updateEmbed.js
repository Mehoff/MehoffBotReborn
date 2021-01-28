module.exports = {
    UpdateEmbed, GetHistoryEmbed
};

const Discord = require("discord.js");

async function UpdateEmbed()
{
    if(!CURRENT){console.log("CURRENT is not defined"); return;}

    let newEmbed = new Discord.MessageEmbed;
    var title = '';
    if(paused)
        title += '⏸️'
    if(repeat)
        title += '🔁'
    
    title += CURRENT.title

    newEmbed.setTitle(title)
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

async function GetHistoryEmbed(song)
{
    let embed = new Discord.MessageEmbed

    embed.setTitle(`${song.title}`)
    embed.setURL(song.url);
    embed.setColor('#8b00ff')
    embed.setThumbnail(song.thumbnail);
    embed.setFooter(`Заказал ${song.author}`)

    return embed;

}