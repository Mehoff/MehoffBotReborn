const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs')
global.client = new Client();
const config = require('./config.json');


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`${command.name} found...`)
}

client.on('ready', () => {

    global.QUEUE = [];
    global.CURRENT = null;
    global.connection = null;    
    global.dispatcher = null;

    // Stream не нужен
    global.stream = null;
    
    // VoiceChannel тоже не нужен...
    global.voiceChannel = null;

    // Возможно тоже будет не нужен.
    global.embed = null;
    global.repeat = false;

    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
  
    if(!message.content.startsWith(config.prefix) || message.author.bot)
        return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    //                                                         music-player                                 bot-testing
    if(!client.commands.has(command) || message.channel.id != '777553955449470986' || message.channel.id != '656574129373315143')
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
// асинхронная работа с ytdl, embed чтобы убрать подлаг при доблавлении нового трека 
// переместить опции ytdl в ytdl-options.json и настроить их работу
// сделать PlayMusic глобальной функцией


