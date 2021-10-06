const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { getSong, getRelatedSong } = require("../functions/getSong");
const { GetEmbed } = require("../functions/updateEmbed");
const { shuffle } = require("../functions/shuffleArray");
const Song = require("../modules/Song");

const musicHistoryChannel = 804284091938766908;

//features: prepeare next stream if next song exists

const options = {
  filter: "audioonly",
  dlChunkSize: 0,
  highWaterMark: 1 << 25,
};

class MusicPlayer {
  constructor() {
    this.queue = [];
    this.radio = false;
    this.radioHistory = [];
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
      this.current = null;
      this.dispatcher = undefined;
      // Clear radioHistory after disconnect
      this.radioHistory = [];
    }
  }

  async parse(message, args) {
    // Если трек уже играет, то можно добавлять в очередь, не находясь на канале
    if (!this.dispatcher && !message.member.voice.channel) return;

    this.channel = message.channel;

    getSong(message, args).then(async (song) => {
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

  async onFinish() {
    if (this.repeat) {
      this.queue.unshift(this.current);
      this.play();
      return;
    }

    if (this.queue.length > 0) {
      this.play();
      return;
    }

    if (this.radio) {
      const nextSong = await getRelatedSong(this.current, this.radioHistory);
      if (nextSong) {
        this.queue.unshift(nextSong);
        this.radioHistory.push(nextSong);
        this.play();
        return;
      } else {
        if (this.channel) {
          await this.channel.send(
            "```Радио прекратило свою работу, из-за того что все треки стали повторятся. СОРИ ЭТО БЕТА Sadge```"
          );
        }
        this.current = null;
        this.disconnect();
        return;
      }
    }

    this.current = null;
    this.disconnect();
  }

  /**
   * Adds Song object to music player song queue array
   * @param {Song} song Song that we add to queue
   */
  add(song) {
    this.queue.push(song);
  }

  async skip() {
    await this.onFinish();
  }

  async play() {
    if (this.queue.length === 0) return;

    this.current = this.queue.shift();
    await this.updateEmbed();

    try {
      const stream = await this.getStream(this.current.url);
      this.dispatcher = this.connection.play(stream);

      this.dispatcher.on("finish", async () => {
        await this.onFinish();
      });

      this.dispatcher.on("error", async (error) => {
        console.log("Dispatcher error", error);
        await this.onFinish();
      });
    } catch (err) {
      console.log("Play error <!>:\n", err);
      if (this.channel) {
        this.channel.send(
          "Ошибка воспроизведения, обратитесь к автору бота :)"
        );
        await this.onFinish();
      }
    }
  }

  async pause() {
    if (this.dispatcher && this.current && !this.paused) {
      this.dispatcher.pause();
      this.paused = true;
      await this.updateEmbed();
    }
  }

  async resume() {
    if (this.dispatcher && this.current && this.paused) {
      this.dispatcher.resume();
      this.paused = false;
      await this.updateEmbed();
    }
  }

  async toggleRepeat() {
    this.repeat = !this.repeat;
    await this.updateEmbed();
  }

  async toggleRadio() {
    this.radio = !this.radio;
    await this.updateEmbed();
  }

  async shuffle() {
    shuffle(this.queue);
    await this.updateEmbed();
  }

  async updateEmbed() {
    const newEmbed = GetEmbed(this);
    this.messageEmbed
      ? this.messageEmbed.edit(newEmbed)
      : (this.messageEmbed = await this.channel.send(newEmbed));

    this.messageEmbed
      .react("⏯️")
      .then(this.messageEmbed.react("⏭️"))
      .then(this.messageEmbed.react("🔀"))
      .then(this.messageEmbed.react("🔁"))
      .then(this.messageEmbed.react("📻"));
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
      case "📻":
        this.toggleRadio();
        break;
    }
  }
}

module.exports = MusicPlayer;
