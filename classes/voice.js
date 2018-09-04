const fs = require('fs');
const tts = require('../lib/voice-rss-tts/index.js');
const connectionConfig = require('../_connectionConfig.json');

const VoiceQueue = require('./voiceQueue.js');
const ttsDirectory = "./tts";

class Voice {
    constructor() {
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
