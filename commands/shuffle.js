const Discord = require('discord.js');

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

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

module.exports = {

    name: 'shuffle',
    descriptions: 'Shuffles songs in queue',
    execute(message, args)
    {
        if(message.content)
            message.delete();

        shuffle(QUEUE);
        UpdateEmbed()

    }

}