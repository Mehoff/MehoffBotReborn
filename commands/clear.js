const { ClearMessages } =  require('../functions/clearMessages');

module.exports = 
{
    name: 'clear',
    description: 'Отчистить канал от сообщений',
    aliases: ['рудз'],

    async execute(message, args)
    {
        await ClearMessages(message.channel, 99).then(deletedMessagesCount => {
            console.log(`Deleted ${deletedMessagesCount} messages`)
        })
    }
}