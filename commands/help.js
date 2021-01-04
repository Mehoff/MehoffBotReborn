const Discord = require('discord.js');


var help_embed = new Discord.MessageEmbed()
    .setThumbnail()
    .setDescription()

module.exports = 
{
    name: 'help',
    description: 'Помощь с командами',
    aliases: ['рудз'],

    async execute(message, args)
    {
        await message.author.send('Тест');
        
        message.delete();
    }
}