module.exports = {
    UpdateEmbed, GetHistoryEmbed
};

const Discord = require("discord.js");

async function UpdateEmbed()
{
    if(!CURRENT){console.log("CURRENT is not defined"); return;}

    let newEmbed = new Discord.MessageEmbed;
    var title = '';
    if(radio)
        title += '📻'
    if(paused)
        title += '⏸️'
    if(repeat)
        title += '🔁'
    
    title += CURRENT.title

    newEmbed.setTitle(`**${title}**`)
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
                .then(embed.react('📻'))
    }
}

async function GetHistoryEmbed(song)
{
    let historyembed = new Discord.MessageEmbed

    historyembed.setTitle(`**${song.title}**`)
    historyembed.setURL(song.url);
    historyembed.setColor('#8b00ff')
    historyembed.setThumbnail(song.thumbnail);
    historyembed.setFooter(`Заказал ${song.author}`)

    return historyembed;

}