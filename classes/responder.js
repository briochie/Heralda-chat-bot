class Responder {
    constructor(client) {
        this.listeners = [];
        this.client = client;

        this._setUpMessageListenerOnClient();
    }

    addListener(options) {
        options.messages.forEach(message => {
            this.listeners.push({
                message: message.toLowerCase(),
                privateAllowed: options.privateAllowed,
                callback: options.callback
            });
        });
    }

    _setUpMessageListenerOnClient() {
        this.client.on('message', message => {
            if (this.client.user.id === message.author.id || !message.isMentioned(this.client.user)) {
                return;
            }

            const messageContent = message.content.toLowerCase();
            this.listeners.forEach(listener => {
                if (!listener.privateAllowed && !message.guild) {
                    return;
                }

                if (messageContent.indexOf(listener.message) >= 0) {
                    console.log("Command Dispatched: ", listener.message)
                    console.log ("Issued at ", new Date(), "by", message.author.username);
                    listener.callback(message);
                }
            });
        });
    }
};

module.exports = Responder;
