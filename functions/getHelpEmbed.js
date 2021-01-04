module.exports = {
    GetHelpEmbed()
};

const Discord = require('discord.js');

async function GetHelpEmbed()
{
    return new Promise((resolve, reject) => {

        var helpEmbed = Discord.MessageEmbed();
        // Динамически подсосать описания каждой команды
        // Составить Embed из !команда + description
    })
} 