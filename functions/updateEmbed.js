module.exports = {
    UpdateEmbed
};

const Discord = require("discord.js");
const { ClearMessages } =  require('../functions/clearMessages');

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

        ClearMessages(channel, 99).then(async deletedMessagesCount => {
            console.log(`Deleted ${deletedMessagesCount} messages`)
            embed = await channel.send(newEmbed);
            embed.react('⏯️')
                .then(embed.react('⏭️'))
                .then(embed.react('🔀'))
                .then(embed.react('🔁'))
        })
    }
}