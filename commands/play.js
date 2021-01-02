const { PlaySong } = require('../functions/playSong.js');
const { UpdateEmbed } = require('../functions/updateEmbed.js');
const { GetSong } = require('../functions/getSong.js');

module.exports = {

    name: 'play',
    description: 'Plays audiostream',
    aliases: ['p','здфн', 'з'],

    async execute(message, args) {
    
    channel = message.channel;
    connection = await message.member.voice.channel.join();
    
    GetSong(message, args)
        .then(song =>{

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