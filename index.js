var Discordie = require('discordie');
var connectionConfig = require('./_connectionConfig.json');
var Responder = require("./components/responder.js");

var client = new Discordie({
    autoReconnect: true
});

const Events = Discordie.Events;
const TtsAnnouncer = require("./components/ttsAnnouncer/index.js");
const ttsAnnouncer = new TtsAnnouncer(client);

client.connect(connectionConfig);
console.log("================ HERALDA ================")
console.log("Started at: ", new Date());

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log("Connected as: ", client.User.username);
    console.log("Connected at: ", new Date());
    console.log("============================");
});

client.Dispatcher.on(Events.DISCONNECTED, (error, autoReconnect, delay) => {
    console.log("CLIENT DISCONNECTED at:", new Date());
    console.log("Error: ", error);
    console.log ("Reconnect (", autoReconnect, ") in", delay);
});

client.Dispatcher.on(Events.VOICE_DISCONNECTED, e => {
    const voiceChannel = e.voiceConnection.channel;
    const maxReconnectAttempts = 5;

    console.log("Client was disconnected at: ", new Date())

    if (e.error) {
        console.log("Client was disconnected at " + new Date() + " with the following error:");
        console.log(e.error);
    }

    if (!voiceChannel) {
        return console.log(voiceChannel.name + " has been deleted.", e.manual);
    }

    if (e.endpointAwait) {
        e.endpointAwait
        .then(info => info.join)
        .catch(err => {
            console.log("Failed to connect to voice channel:", err);
        });
    }
    else if (!e.manual) {
        console.log("Attempting to reconnect to voice channel.");
        var reconnectAttempts = 0;

        var reconnectInterval = setInterval(() => {
            reconnectAttempts++;

            voiceChannel.join()
            .then(() => {
                console.log("Reconnected to:", voiceChannel.name);
                clearInterval(reconnectInterval);
            })
            .catch(err => {
                console.log("(Attempt Interval) Failed to connect to voice channel:", err);
            });

            if (reconnectAttempts >= 5) {
                clearInterval(reconnectInterval);
            }
        }, 500);
        
    }
});

client.Dispatcher.on(Events.VOICE_CHANNEL_JOIN, e => {
    if (e.user.id === client.User.id) {
        return;
    }

    var announcedName = e.user.username;
    const userGuildMember = e.user.memberOf(e.channel.guild_id);

    if (userGuildMember) {
        announcedName = userGuildMember.name;
    }

    const message = announcedName + " has connected.";
    playTTSAudio(e.channel.id, message);
});

client.Dispatcher.on(Events.VOICE_CHANNEL_LEAVE, e => {
    var announcedName = e.user.username;
    const userGuildMember = e.user.memberOf(e.channel.guild_id);

    if (userGuildMember) {
        announcedName = userGuildMember.name;
    }
    
    const message = announcedName + " has left the channel.";
    playTTSAudio(e.channel.id, message);
});

//General listeners
this.responder = new Responder(client);

this.responder.addListener(["get in here"], e => {
    if (!client.User.isMentioned(e.message) && !e.message.isPrivate) {
        return;
    }

    const voiceChannel = findUsersVoiceChannel(e.message.author);

    if (!voiceChannel) {
        return;
    }

    if (voiceChannel.joined) {
        e.message.channel.sendMessage("I'm already in your voice channel.");
        return;
    }

    voiceChannel.join().then((voiceInfo, err) => {
        const message = "Heralda, as summoned.";

        if (err) {
            console.log(err);
            return;
        }

        playTTSAudio(voiceChannel.id, message);
    });
}, true);

this.responder.addListener(["get out of here"], e => {
    if (!client.User.isMentioned(e.message) && !e.message.isPrivate) {
        return;
    }

    const voiceChannel = findUsersVoiceChannel(e.message.author);

    if (!voiceChannel) {
        e.message.channel.sendMessage("I'm not in a voice channel.");
        return;
    }

    ttsAnnouncer.clearQueue();
    voiceChannel.leave();
}, true);

function findUsersVoiceChannel(user) {
    var voiceChannel;
    client.Guilds.forEach(guild => {
        if (user.memberOf(guild)) {
            var potentialConnection = user.getVoiceChannel(guild);

            if (potentialConnection) {
                voiceChannel = potentialConnection;
            }
        }
    });

    return voiceChannel;
}

function playTTSAudio(channelId, message) {
    const info = client.VoiceConnections[0];

    if (!info) {
        return;
    }

    if (info.voiceConnection.channelId !== channelId) {
        return;
    }

    ttsAnnouncer.announce(message);
}
