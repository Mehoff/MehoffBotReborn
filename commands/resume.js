const { UpdateEmbed } = require("../functions/updateEmbed");

module.exports = {
	name: 'resume',
        description: 'Resumes current song',
        alliases: ['куыгьу'],

	execute(message, args) {
        if(dispatcher)
        {
            dispatcher.resume();
            UpdateEmbed()

            if(message.content)
                message.delete();
        }
	},
};