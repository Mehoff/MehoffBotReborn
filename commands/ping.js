module.exports = {
	name: 'ping',
        description: 'Pings',
        aliases: ['зфгыу'],

	execute(message, args) {
        message.reply('Calculating ping...').then(resultMessage =>{
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
            message.reply(`Bot latency ${ping}`)
        })
	},
};