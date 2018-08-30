const fs = require('fs');
const tts = require('../../lib/voice-rss-tts/index.js');
const connectionConfig = require('../../_connectionConfig.json');

const ttsDirectory = "./tts";

var ttsQueue = [];

module.exports = ttsAnnouncer;

function ttsAnnouncer(client) {
    this.client = client;
}

ttsAnnouncer.prototype.announce = function (voiceChannel, message) {
    const fileName = message.replace(/[.,\\\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(" ").join("_").toLowerCase() + ".mp3";

    readyAnnouncementFile(message, fileName, (err, filePath) => {
        console.log('playing message: ' + message);
        voiceChannel.connection.playFile(filePath);
    });
}

ttsAnnouncer.prototype.clearQueue = function() {
    ttsQueue = [];
}

function play(voiceChannel) {
    const fileToPlay = ttsQueue[0];

    if (!fileToPlay) {
        return;
    }

    voiceChannel.connection.playFile(fileToPlay).on('end', () => {
        ttsQueue.splice(0, 1);
        if (ttsQueue.length >= 1) {
            play(voiceChannel);
        }
    });
}

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
};
