module.exports = Herald;

const Discord = require('discord.js');
const Responder = require("./responder.js");
const Voice = require("./voice.js");

function Herald(client) {
  this.responder = new Responder(client);

  const ttsAnnouncer = new Voice(client);

  this.responder.addListener({
    messages: ['get in here', 'you\'ve been summoned'],
    privateAllowed: true,
    callback: summonedToChat
  });

  this.responder.addListener({
    messages: ['dismissed', 'get out of here'],
    privateAllowed: false,
    callback: leaveChat
  });

  client.on('voiceStateUpdate', (oldState, newState) => {
      const guildConnection = client.voiceConnections.get(newState.guild.id);

      if (newState.user.id == client.user.id || !guildConnection) {
          return;
      }

      if (newState.voiceChannel && newState.voiceChannel.id === guildConnection.channel.id) {
          announceUserArrival(newState, guildConnection.channel);
      }
      else if (oldState.voiceChannel.id === guildConnection.channel.id) {
          announceUserExit(oldState, guildConnection.channel);
      }
  });

  function summonedToChat(message) {
    if (!message.guild || message.author.id === client.user.id) {
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

        ttsAnnouncer.announce(voiceChannel, message);
    });
  }

  function leaveChat(message) {
    const voiceChannel = message.member.voiceChannel;

    if (voiceChannel.connection && voiceChannel.connection.status === Discord.Constants.VoiceStatus.CONNECTED) {
        voiceChannel.leave();
    }
  }

  function announceUserArrival(guildUser, voiceChannel) {
      const message = guildUser.nickname + " has connected.";
      ttsAnnouncer.announce(voiceChannel, message);
  }

  function announceUserExit(guildUser, voiceChannel) {
      const message = guildUser.nickname + " has left the channel.";
      ttsAnnouncer.announce(voiceChannel, message);
  }
}
