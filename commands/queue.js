module.exports = {
	name: 'queue',
	description: 'Pauses current song',
	execute(message, args) {
        if(dispatcher)
        {
            var str = `Current: ${CURRENT.title}\n`
            
            var i = 1;
            for(const item of QUEUE){
                str += `${i}.${item.title}\n`;
                i+=1;
            }

            message.channel.send(str);
            message.delete();
        }
	},
};