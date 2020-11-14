const Discord = require('discord.js');
const client = new Discord.Client();
const tokens = require('./tokens.json');
const ytdl = require('ytdl-core');

let connection = null;
let stream = null;
let dispatcher = null;
let voiceChannel = null;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if(!message.guild) return;


    if(message.content === 'dc')
    {
        if(!voiceChannel) return;

        voiceChannel.leave();
    }

    if (message.content === 'play') {
    if(message.member.voice.channel)
    {
        voiceChannel = message.member.voice.channel;

        var url = 'https://www.youtube.com/watch?v=grqiHWheAMg&ab_channel=SootHouse'
        if(!ytdl.validateURL(url))
        {
            message.reply('URL is not Valid');
            return;
        }
        connection = await message.member.voice.channel.join();
        stream = ytdl(url, 
            {
                filter: "audioonly",
                dlChunkSize: 0
            }
        );
        dispatcher = connection.play(stream);
    }
    else
    {
        message.reply('Сначала подключись к голосовому каналу!')
    }
  }
});


client.login(tokens["discord-token"]);