const Discord = require('discord.js');


//
let help_embed = new Discord.MessageEmbed()
    .setThumbnail()
    .setDescription('Тут будет help :)')

module.exports = 
{
    name: 'help',
    description: 'Помощь с командами',

    async execute(message, args)
    {
        await message.channel.send(help_embed);
            message.delete();
    }
}