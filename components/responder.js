var Discordie = require('discordie');

const Events = Discordie.Events;
module.exports = Responder;

function Responder(client) {
    this.listeners = [];

    client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
        //TODO: It would be cool to add private listeners in the future.
        if (client.User.id === e.message.author.id) {
            return;
        }

        const messageContent = e.message.content.toLowerCase();
        this.listeners.forEach(listener => {
            if (e.message.isPrivate && !listener.privateAllowed) {
                return;
            }

            if (messageContent.indexOf(listener.message) >= 0) {
                console.log("Command Dispatched: ", listener.message)
                console.log ("Issued at ", new Date(), "by", e.message.author.username);
                listener.callback(e);
            }
        });
    });
};

Responder.prototype.addListener = function (messages, callback, privateAllowed = false) {
    messages.forEach(message => {
        this.listeners.push({
            message: message.toLowerCase(),
            privateAllowed: privateAllowed,
            callback: callback
        });
    });
};
