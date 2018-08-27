const fs = require('fs');
const tts = require('../../lib/voice-rss-tts/index.js');
const connectionConfig = require('../../_connectionConfig.json');

const ttsDirectory = "./tts";

var ttsQueue = [];

module.exports = ttsAnnouncer;

function ttsAnnouncer(client) {
    this.client = client;
}

ttsAnnouncer.prototype.announce = function (message) {
    const fileName = message.replace(/[.,\\\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(" ").join("_").toLowerCase() + ".mp3";

    readyAnnouncementFile(message, fileName, (err, filePath) => {
        if (err) {
            console.error(err);
            return;
        }

        if (ttsQueue.length === 0) {
            ttsQueue.push(filePath);
            play(this.client);
        }
        else {
            ttsQueue.push(filePath);
        }
    });
}

ttsAnnouncer.prototype.clearQueue = function() {
    ttsQueue = [];
}

function play(client) {
    const info = client.VoiceConnections[0];
    const fileToPlay = ttsQueue[0];

    if (!fileToPlay) {
        return;
    }

    var encoder = info.voiceConnection.createExternalEncoder({
        type: "ffmpeg",
        source: fileToPlay
    });
    encoder.play();

    encoder.once("end", () => {
        ttsQueue.splice(0, 1);
        if (ttsQueue.length >= 1) {
            play(client);
        }
    });
}

function writeNewSoundFile(filePath, content, callback) {
    fs.mkdir(ttsDirectory, (err) => fs.writeFile(filePath, content, (err) => callback(err)));
}

function callVoiceRssApi(message, filePath, callback) {
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
