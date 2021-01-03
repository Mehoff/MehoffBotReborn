module.exports = {
    ClearMessages,
};


async function ClearMessages(channel, limit)
{
    return new Promise((resolve, reject) => {
        try{
            channel.messages.fetch({limit: limit})
            .then(msgs => {
                channel.bulkDelete(msgs)
                    .then((deletedMessages) => {
                        resolve(deletedMessages.size)
                    })
            })
        }
        catch(error){
            reject();
        }
    })

}


// Для любых сообщений
// async function ClearMessages(channel, limit)
// {
//     return new Promise(async (resolve, reject) => {
//         try{
//             await channel.messages.fetch({limit: limit})
//                 .then(fetched =>
//                     {
//                         fetched.forEach(async msg => {
//                             await msg.delete();
//                         })
//                     })
//         }
//         catch(error){
//             reject(error);
//         }
//     })

// }
