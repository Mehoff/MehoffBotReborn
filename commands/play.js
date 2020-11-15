const Commando = require('discord.js-commando')
const ytdl = require('ytdl-core')


module.exports = {
    
    
    
    name: 'play',
    description: 'Plays audiostream',
    async execute(message, args) {


    if(!ytdl.validateURL(args[0]))
        {
            message.channel.send('Некорректный запрос, либо вы не подключены к голосовому каналу');
            return;
        }
    
        // get more info about yt video by link, and create ytvideoobject instead of just link...
        const url = args[0];
        QUEUE.push(url)

        //voiceChannel = message.member.voice.channel;
        
        // Бот уже в голосовом канале, по этому больше делать ничего не нужно.
        if(CURRENT == null)
        {
        connection = await message.member.voice.channel.join();
        var stream = ytdl(url,
            {
                filter: "audioonly",
                dlChunkSize: 0,
                highWaterMark: 1<<25,
            });

        dispatcher = connection.play(stream);
        CURRENT = url;
        QUEUE.shift();

        dispatcher.on("finish", () =>
        {
            console.log('dispatcher::finish');

            CURRENT = null;
            if(QUEUE.length == 0)
                connection.disconnect();
            else
            {
                CURRENT = QUEUE[0];
                QUEUE.shift();
                
                var stream = ytdl(CURRENT, {
                    filter: "audioonly",
                    dlChunkSize: 0,
                    highWaterMark: 1<<25,
                });
                
                dispatcher = connection.play(stream);
            }
        })

        }
    }   
};