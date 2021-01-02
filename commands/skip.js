const { PlaySong } = require('../functions/playSong.js');
const { UpdateEmbed } = require('../functions/updateEmbed.js');

module.exports = {
	name: 'skip',
    description: 'Skips the song',
    alliases: ['ылшз'],

    execute(message, args){
        
        if(message.content)
            message.delete();

        if(!dispatcher || !connection)
            return;

        if(QUEUE.length > 0)
        {
            CURRENT = QUEUE.shift();
            PlaySong(CURRENT.url);
            UpdateEmbed();

        } else {
            dispatcher.destroy();
            connection.disconnect();
            CURRENT = null;
        }
        
    }
};