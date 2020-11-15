const Discord = require('discord.js');
const DiscordCommando = require('discord.js-commando')
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs')
global.client = new Client();
const config = require('./config.json');
const ytdl = require('ytdl-core');


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`${command.name} set...`)
}



client.on('ready', () => {

    global.QUEUE = [];
    global.CURRENT = null;
    global.connection = null;
    global.stream = null;
    global.dispatcher = null;
    global.voiceChannel = null;

    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
  
    if(!message.content.startsWith(config.prefix) || message.author.bot)
        return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command))
        return;
    try
    {
        client.commands.get(command).execute(message, args);
    }
    catch(error)
    {
        console.error(error)
        message.channel.send('Ошибка во время вызова команды :C')
    }

    //clients.commands.get('ping').execute(message, args)

//     if (message.content === 'how to embed') {
        
//     const embed = new MessageEmbed()
//       .setTitle('A slick little embed')
//       .setColor(0xff0000)

//     message.channel.send(embed);
//   }

//     if (message.content === 'dc')
//     {
//         if(!voiceChannel) return;

//         voiceChannel.leave();
//     }

//     
  }
);


client.login(config["discord-token"]);

//https://discord.js.org/#/docs/main/master/class/MessageEmbed

//  TODO:  \\

// GET Metainfo from ytdl for rich interface
// MongoDB for personal playlists
// Add Repeat toggle
// add .env usage instead of confing.json
// add embed...

