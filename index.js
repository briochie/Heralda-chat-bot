const Discord = require('discord.js');
const client = new Discord.Client();

const connectionConfig = require('./_connectionConfig.json');
const Responder = require("./components/responder.js");

const HeraldPlugin = require('./components/herald.js');

process.on('exit', destroyOnExit);
process.on('SIGINT', destroyOnExit);
process.on('SIGUSR1', destroyOnExit);
process.on('SIGUSR2', destroyOnExit);

client.login(connectionConfig.token).then(() => {
    console.log("================ HERALDA ================")
    console.log("Started at: ", new Date());
    console.log("Connected as: ", client.user.tag);
    console.log("Connected at: ", new Date());
    console.log("============================");
}).catch((err) => {
    console.error("Connection Failed: " + err);
    process.exitCode = 1;
});

const Herald = new HeraldPlugin(client);

function destroyOnExit() {
    console.log("Exiting program, destroying session.");
    client.destroy();
}
