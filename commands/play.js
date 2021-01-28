const { PlaySong } = require('../functions/playSong.js');
const { UpdateEmbed, GetHistoryEmbed } = require('../functions/updateEmbed.js');
const { GetSong } = require('../functions/getSong.js');

const music_history = '804284091938766908'

module.exports = {

    name: 'play',
    description: 'Plays audiostream',
    aliases: ['p','здфн', 'з'],

    async execute(message, args) {
    
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

            await message.client.channels.cache.get(music_history).send(await GetHistoryEmbed(song))

            message.delete()
        })
    }  
};