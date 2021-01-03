module.exports = {
	name: 'resume',
        description: 'Resumes current song',
        alliases: ['куыгьу'],

	execute(message, args) {
        if(dispatcher)
        {
            dispatcher.resume();

            if(message.content)
                message.delete();
        }
	},
};