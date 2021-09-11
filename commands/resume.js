const { UpdateEmbed } = require("../functions/updateEmbed");

module.exports = {
  name: "resume",
  description: "Resumes current song",
  alliases: ["куыгьу"],

  execute(message, args) {
    console.log("resume exec");
    //if (dispatcher) {
    console.log("resume dispatcher");
    dispatcher.resume();
    UpdateEmbed();

    if (message.content) message.delete();
    //}
  },
};
