module.exports = {
	name: 'queue',
	description: 'Pauses current song',
	execute(message, args) {
        if(dispatcher)
        {
            var str = `Current: ${CURRENT}\n`
            
            var i = 1;
            for(const item of QUEUE){
                str += `${i}.${item}\n`;
                i+=1;
            }

            message.channel.send(str);
        }
	},
};