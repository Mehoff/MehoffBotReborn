const { UpdateEmbed } = require('../functions/updateEmbed.js');
const { Shuffle } = require('../functions/shuffleArray.js');


module.exports = {

    name: 'shuffle',
    descriptions: 'Shuffles songs in queue',
    aliases: ['ыргааду'],

    execute(message, args)
    {
        if(message.content)
            message.delete();

        Shuffle(QUEUE);
        UpdateEmbed();
    }

}