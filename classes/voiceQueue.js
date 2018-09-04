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

module.exports = VoiceQueue;
