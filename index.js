const Discord = require('discord.js');
const { Client } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const { UpdateEmbed } = require('./functions/updateEmbed');

global.client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`${command.name} found...`)
}

client.on('ready', () => {

    client.user.setActivity('nothing', {type: 'PLAYING'})
    global.QUEUE = [];
    global.CURRENT = null;
    global.connection = null;    
    global.dispatcher = null;
    global.channel = null;


    // Stream не нужен
    global.stream = null;
    
    // VoiceChannel тоже не нужен...
    global.voiceChannel = null;

    global.embed = null;
    global.repeat = false;
    global.paused = false;
    global.radio = false;

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

    if(message.channel.id != '777553955449470986' || !client.commands.has(command) || !command){
        await message.delete(); return;
    }

    try {
        client.commands.get(command).execute(message, args);
    }
    
    catch(error) {
        console.error(error)
        message.channel.send('Ошибка во время вызова команды :C')
            .then(msg => {msg.delete({timeout: 2000})})
    }
  }
);

client.on('messageReactionAdd', async (reaction, user) =>{

    if(user.bot)
        return;

    // if(reaction.partial)
    // {
    //     try
    //     {
    //         await reaction.fetch();
    //     }
    //     catch(err)
    //     {
    //         console.log('Reaction exception', err);
    //         return;
    //     }
    // }

    if(embed)
        embed.reactions.resolve(reaction).users.remove(user.id);

    switch(reaction.emoji.name)
    {
        // case '▶️':
        //     client.commands.get('play').execute(reaction.message, reaction.message.embeds[0].url)
        //     break;
        case '⏯️': 
            if(!paused)
            {
                paused = true;
                client.commands.get('pause').execute(reaction.message, null);
            } else { 
                paused = false;
                client.commands.get('resume').execute(reaction.message,null); 
            }
            break;
        case '⏭️': 
                client.commands.get('skip').execute(reaction.message, null);
            break;
        case '🔀': 
                client.commands.get('shuffle').execute(reaction.message, null);   
            break;
        case '🔁':
            repeat = !repeat;
            UpdateEmbed();
            break;
        case '📻':
            radio = !radio;
            UpdateEmbed();
            // reaction.message.channel.send('Радио находится в разработке...', {files: ['https://emoji.gg/assets/emoji/9716_Pepega.png']})
            //     .then(msg => {msg.delete({timeout: 2000})})
             break;

    }
    
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

