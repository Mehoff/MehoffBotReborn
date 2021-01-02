const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const { endsWith } = require('ffmpeg-static');
const fs = require('fs');
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
    global.channel = null;

    // Stream не нужен
    global.stream = null;
    
    // VoiceChannel тоже не нужен...
    global.voiceChannel = null;

    // embed нужно задать сообщение находящиеся в канале
    global.embed = null;
    global.repeat = false;
    global.paused = false;

    global.options = 
    {
        filter: "audioonly",
        dlChunkSize: 0,
        highWaterMark: 1<<25,
    }

    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
  
    if(!message.content.startsWith(config.prefix) || message.author.bot)
        return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    //    if(!client.commands.has(command) && message.channel.id === '777553955449470986')   
    //     return;
   
    if(message.channel.id != '777553955449470986'){
        message.channel.send('Перейди в канал music-player!').then(msg => {msg.delete({timeout: 2000})})
        message.delete();
        return;
    }

    try
    {
        client.commands.get(command).execute(message, args);
    }
    catch(error)
    {
        console.error(error)
        message.channel.send('Ошибка во время вызова команды :C')
            .then(msg => {msg.delete({timeout: 2000})})
    }
    //message.delete()     
  }
);

client.on('messageReactionAdd', async (reaction, user) =>{
    if(user.bot)
        return;

    switch(reaction.emoji.name)
    {
        case '⏯️': 
            if(!paused)
            {
                paused = true;
                client.commands.get('pause').execute(reaction.message, null);
                //embed.setTitle(CURRENT.title + '[Пауза]')
                
            } else { 
                paused = false;
                client.commands.get('resume').execute(reaction.message,null); 
                //embed.setTitle(CURRENT.title);
            }
            break;
        case '⏭️': 
                client.commands.get('skip').execute(reaction.message, null);
            break;
        case '🔀': 
                client.commands.get('shuffle').execute(reaction.message, null);   
            break;
        case '🔁':
            if(!repeat)
            {
                repeat = true;
                //embed.setFooter(`Текущий заказал: ${CURRENT.author} - [НА ПОВТОРЕ]`)
            } else {

                repeat = false;
                //embed.setFooter(`Текущий заказал: ${CURRENT.author}`)
            }
            break;
    }

    if(embed)
        embed.reactions.resolve(reaction).users.remove(user.id);
})

client.login(config["discord-token"]);

//https://discord.js.org/#/docs/main/master/class/MessageEmbed

//  TODO:  \\

// GET Metainfo from ytdl for rich interface
// MongoDB for personal playlists and more
// add embed...
// .evn support
// node-ytpl
// асинхронная работа с ytdl, embed чтобы убрать подлаг при доблавлении нового трека
// skip last
// skip front
// search {Название трека} {Кол-во результатов}
// playlist

