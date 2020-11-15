module.exports = {
	name: 'resume',
	description: 'Pauses current song',
	execute(message, args) {
        if(dispatcher)
        {
            dispatcher.resume();
            message.delete();
        }
	},
};