const Discord = require('discord.js');
const client = new Discord.Client();

const connectionConfig = require('./_connectionConfig.json');
const Responder = require("./components/responder.js");

const HeraldPlugin = require('./components/herald.js');

client.login(connectionConfig.token).then(() => {
    console.log("================ HERALDA ================")
    console.log("Started at: ", new Date());
    console.log("Connected as: ", client.user.tag);
    console.log("Connected at: ", new Date());
    console.log("============================");
}).catch(() => {
    console.error("Connection Failed");
});

const Herald = new HeraldPlugin(client);

process.on('exit', destroyOnExit);
process.on('SIGINT', destroyOnExit);
process.on('SIGUSR1', destroyOnExit);
process.on('SIGUSR2', destroyOnExit);

function destroyOnExit() {
    console.log("Exiting program, destroying session.");
    client.destroy();
    process.exit();
}
