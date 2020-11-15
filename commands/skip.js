const { BroadcastDispatcher } = require("discord.js");
const queue = require("./queue");

module.exports = {
	name: 'skip',
	description: 'Skips the song',
    execute(message, args){
        
        dispatcher.end();
        // if(!dispatcher){
        //     message.channel.send('Ничего не играет...'); return;}
        // if(!connection){
        //     message.channel.send('Ничего не играет...'); return;}
        
        
        // if(QUEUE.length > 0){
        
        // dispatcher = connection.play(QUEUE[0]);
        // CURRENT = QUEUE[0]
        // QUEUE.shift();
        
        // }
        message.channel.send('Пропускаем композицию...')
        

    }
};