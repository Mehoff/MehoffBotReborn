const { GetSong } = require("../functions/getSong");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const { GetEmbed } = require("../functions/updateEmbed");
const Song = require("../modules/Song");
const { shuffle } = require("../functions/shuffleArray");

const musicHistory = 804284091938766908;

//features: prepeare next stream if next song exists

const options = {
  filter: "audioonly",
  dlChunkSize: 0,
  highWaterMark: 1 << 25,
};

class MusicPlayer {
  constructor() {
    this.queue = [];
    this.current = null;
    this.paused = false;
    this.repeat = false;
    this.connection = undefined;
    this.dispatcher = undefined;
    this.messageEmbed = undefined;
    this.channel = undefined;
  }

  async connect(voiceChannel) {
    this.connection = await voiceChannel.join();
  }

  disconnect() {
    if (this.connection) {
      this.connection.disconnect();
      this.connection = null;
    }
  }

  async parse(message, args) {
    this.channel = message.channel;
    GetSong(message, args).then(async (song) => {
      if (!song) {
        message.channel.send("Не удалось воспроизвести трек");
        return;
      }

      this.add(song);

      if (!this.connection || message.guild.voiceConnection) {
        await this.connect(message.member.voice.channel);
      }

      this.current ? this.updateEmbed() : this.play();
    });
  }

  async getStream(url) {
    const stream = await ytdl(url, options);
    stream.on("error", (err) => {
      console.log(err);
    });
    return stream;
  }

  onFinish() {
    if (this.repeat) {
      this.queue.unshift(this.current);
      this.play();
      return;
    }

    if (this.queue.length > 0) {
      this.play();
    } else {
      this.current = undefined;
      this.disconnect();
    }
  }

  /**
   * Adds Song object to music player song queue array
   * @param {Song} song Song that we add to queue
   */
  add(song) {
    this.queue.push(song);
  }

  skip() {
    this.onFinish();
  }

  async play() {
    if (this.queue.length === 0) return;

    this.current = this.queue.shift();

    this.updateEmbed();

    try {
      const stream = await this.getStream(this.current.url);

      this.dispatcher = this.connection.play(stream);

      // this.dispatcher.on("start", async () => {
      // });

      this.dispatcher.on("finish", async () => {
        this.onFinish();
      });
    } catch (err) {
      if (this.channel)
        this.channel.send(
          "Ошибка воспроизведения, обратитесь к автору бота :)"
        );

      this.onFinish();
    }
  }

  pause() {
    if (this.dispatcher && this.current && !this.paused) {
      this.dispatcher.pause();
      this.paused = true;
      this.updateEmbed();
    }
  }

  resume() {
    if (this.dispatcher && this.current && this.paused) {
      this.dispatcher.resume();
      this.paused = false;
      this.updateEmbed();
    }
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
    this.updateEmbed();
  }

  shuffle() {
    shuffle(this.queue);
    this.updateEmbed();
  }

  async updateEmbed() {
    const newEmbed = GetEmbed(this);

    if (this.messageEmbed) {
      this.messageEmbed.edit(newEmbed);
    } else {
      this.messageEmbed = await this.channel.send(newEmbed);
    }

    this.messageEmbed
      .react("⏯️")
      .then(this.messageEmbed.react("⏭️"))
      .then(this.messageEmbed.react("🔀"))
      .then(this.messageEmbed.react("🔁"));
  }
  /**
   * Method whitch triggers when user reacts to any the message of guild
   * @param {Discord.MessageReaction} messageReaction Reaction object
   * @param {Discord.User} user User who triggered event
   */
  async onReaction(messageReaction, user) {
    // Return if user reacted to message which is not our player message
    if (!messageReaction.message == this.messageEmbed) return;
    // Delete user reaction right after it triggered this function
    this.messageEmbed.reactions.resolve(messageReaction).users.remove(user.id);

    switch (messageReaction.emoji.name) {
      case "⏯️":
        this.paused ? this.resume() : this.pause();
        break;
      case "⏭️":
        this.skip();
        break;
      case "🔀":
        this.shuffle();
        break;
      case "🔁":
        this.toggleRepeat();
        break;
    }
  }
}

module.exports = MusicPlayer;
