module.exports = {
	name: 'pause',
        description: 'Pauses current song',
        aliases: ['зфгыу'],

	execute(message, args) {
        if(dispatcher)
        {
            dispatcher.pause();

            if(message.content)
                message.delete();
        }
	},
};