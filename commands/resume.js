module.exports = {
	name: 'resume',
	description: 'Pauses current song',
	execute(message, args) {
        if(dispatcher)
        {
            dispatcher.resume();

            if(message.content)
                message.delete();
        }
	},
};