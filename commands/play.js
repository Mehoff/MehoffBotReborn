const { PlaySong } = require('../functions/playSong.js');
const { UpdateEmbed, GetHistoryEmbed } = require('../functions/updateEmbed.js');
const { GetSong } = require('../functions/getSong.js');

module.exports = {

    name: 'play',
    description: 'Plays audiostream',
    aliases: ['p','здфн', 'з'],

    async execute(message, args) {

    
        // Почему-то не работает
    if(!message.member.voice.channel && !message.author.bot){
        message.channel.send('Для начала зайди в голосовой канал 🙂').then(msg => msg.delete({timeout : 2000})); return;}

    channel = message.channel;
    connection = await message.member.voice.channel.join();
    
    GetSong(message, args)
        .then(async song =>{

        QUEUE.push(song);

        if(CURRENT == null) 
            {
                CURRENT = QUEUE.shift();
                PlaySong(CURRENT.url);
            }

            UpdateEmbed();

            message.delete()
        })
    }  
};