const { UpdateEmbed } = require('../functions/updateEmbed.js');

module.exports = {
	name: 'pause',
        description: 'Pauses current song',
        aliases: ['зфгыу'],

	execute(message, args) {
        if(dispatcher)
        {
            dispatcher.pause();
            UpdateEmbed()

            if(message.content)
                message.delete();
        }
	},
};