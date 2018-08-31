const Discord = require('discord.js');
const Responder = require("./responder.js");
const Voice = require("./voice.js");

class Herald {
  constructor(client) {
    this.client = client;
    this.responder = new Responder(client);
    this.voice = new Voice(client);

    this._listenForSummons();
    this._listenForVoiceStatusChanges();
  }

  _listenForSummons() {
    this.responder.addListener({
      messages: ['get in here', 'you\'ve been summoned'],
      privateAllowed: true,
      callback: this._summonedToChat.bind(this)
    });

    this.responder.addListener({
      messages: ['dismissed', 'get out of here'],
      privateAllowed: false,
      callback: this._leaveChat.bind(this)
    });
  }

  _listenForVoiceStatusChanges() {
    this.client.on('voiceStateUpdate', (oldState, newState) => {
      const guildConnection = this.client.voiceConnections.get(newState.guild.id);

      if (newState.user.id == this.client.user.id || !guildConnection) {
          return;
      }

      if (newState.voiceChannel && newState.voiceChannel.id === guildConnection.channel.id) {
          this._announceUserArrival(newState, guildConnection.channel);
      }
      else if (oldState.voiceChannel.id === guildConnection.channel.id) {
          this._announceUserExit(oldState, guildConnection.channel);
      }
    });
  }

  _summonedToChat(message) {
    if (!message.guild || message.author.id === this.client.user.id) {
      return;
    }

    const voiceChannel = message.member.voiceChannel;

    if (voiceChannel.connection && voiceChannel.connection.status === Discord.Constants.VoiceStatus.CONNECTED) {
      message.reply("I'm already in your voice channel.");
      return;
    }

    voiceChannel.join().then((voiceInfo, err) => {
      const message = "Heralda, as summoned.";

      if (err) {
        console.log(err);
        return;
      }

      this.voice.announce(voiceChannel, message);
    });
  }

  _leaveChat(message) {
    const voiceChannel = message.member.voiceChannel;

    if (voiceChannel.connection && voiceChannel.connection.status === Discord.Constants.VoiceStatus.CONNECTED) {
        voiceChannel.leave();
    }
  }

  _announceUserArrival(guildMember, voiceChannel) {
    const message = (guildMember.nickname || guildMember.user.username) + " has connected.";
    this.voice.announce(voiceChannel, message);
  }

  _announceUserExit(guildMember, voiceChannel) {
    const message = (guildMember.nickname || guildMember.user.username) + " has left the channel.";
    this.voice.announce(voiceChannel, message);
  }
}

module.exports = Herald;
