const fs = require('fs');
const tts = require('../lib/voice-rss-tts/index.js');
const connectionConfig = require('../_connectionConfig.json');

const ttsDirectory = "./tts";

class VoiceQueue {
    constructor() {
        this.voiceChannelAudioQueues = {};
    }

    queueAudioForChannel(filePath, voiceChannel) {
        if (!this.voiceChannelAudioQueues[voiceChannel.id]) {
            this.voiceChannelAudioQueues[voiceChannel.id] = [];
        }

        this.voiceChannelAudioQueues[voiceChannel.id].push(filePath);
        this.playNextForVoiceChannel(voiceChannel);
    }

    playNextForVoiceChannel(voiceChannel) {
        if (this.voiceChannelAudioQueues[voiceChannel.id].length <= 0 || voiceChannel.connection.speaking) {
            return;
        }

        let audio = this.voiceChannelAudioQueues[voiceChannel.id][0];
        console.log('playing audio: ' + audio);
        voiceChannel.connection.playFile(audio).on('end', () => {
            this.voiceChannelAudioQueues[voiceChannel.id].splice(0, 1);
            this.playNextForVoiceChannel(voiceChannel);
        });
    }
}

class Voice {
    constructor(client) {
        this.client = client;
        this.voiceQueue = new VoiceQueue();
    }

    announce(voiceChannel, message) {
        const fileName = message.replace(/[.,\\\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(" ").join("_").toLowerCase() + ".mp3";

        readyAnnouncementFile(message, fileName, (err, filePath) => {
            console.log('queueing message: ' + message);
            this.voiceQueue.queueAudioForChannel(filePath, voiceChannel);
        });
    }
}

Voice.VoiceQueue = VoiceQueue;

module.exports = Voice;

function writeNewSoundFile(filePath, content, callback) {
    fs.mkdir(ttsDirectory, (err) => fs.writeFile(filePath, content, (err) => callback(err)));
}

function callVoiceRssApi(message, filePath, callback) {
    console.log("Making API call");
    tts.speech({
        key: connectionConfig.voiceApiKey,
        hl: 'en-gb',
        src: message,
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false,
        b64: false,
        callback: (err, content) => {
            if (err) {
                callback(err);
            }
            writeNewSoundFile(filePath, content, (err) => {
                callback(err);
            });
        }
    });
};

function readyAnnouncementFile(message, fileName, callback) {
    const filePath = ttsDirectory + "/" + fileName;

    fs.stat(filePath, (err) => {
        if (err && err.code == 'ENOENT') {
            callVoiceRssApi(message, filePath, (err) => callback(err, filePath));
            return;
        }

        callback(err, filePath);
    });
}
