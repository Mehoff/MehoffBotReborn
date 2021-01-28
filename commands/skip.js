const { GetNextRelated } = require('../functions/getNextRelated.js');
const { GetSongByYTLink } = require('../functions/getSong.js');
const { PlaySong } = require('../functions/playSong.js');
const { UpdateEmbed } = require('../functions/updateEmbed.js');

module.exports = {
	name: 'skip',
    description: 'Skips the song',
    alliases: ['ылшз'],

    async execute(message, args){
        
        if(message.content)
            message.delete();

        if(!dispatcher || !connection)
            return;

        if(QUEUE.length > 0)
        {
            CURRENT = QUEUE.shift();
            PlaySong(CURRENT.url);
            UpdateEmbed();
        }
        else if(radio)
        {
            await GetNextRelated(CURRENT.url)
                .then(async related => await GetSongByYTLink(related)
                    .then(song => {
                        CURRENT = song;
                        PlaySong(CURRENT.url)
                        UpdateEmbed();
                }))
        } 
        else
        {
            dispatcher.destroy();
            connection.disconnect();
            CURRENT = null;
        }
        
    }
};