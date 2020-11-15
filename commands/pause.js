module.exports = {
	name: 'pause',
	description: 'Pauses current song',
	execute(message, args) {
        if(dispatcher)
        {
            dispatcher.pause();
            message.delete();
        }
	},
};