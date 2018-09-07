const Discord = require('discord.js');
const globby = require('globby');

const client = new Discord.Client();

const config = require('./_config.json');

process.on('exit', destroyOnExit);
process.on('SIGINT', destroyOnExit);
process.on('SIGUSR1', destroyOnExit);
process.on('SIGUSR2', destroyOnExit);

var plugins = [];

client.login(config.token).then(() => {
    console.log("================ HERALDA ================")
    console.log("Started at: ", new Date());
    console.log("Connected as: ", client.user.tag);
    console.log("Connected at: ", new Date());
    console.log("============================");

    loadInstalledPlugins();
}).catch((err) => {
    console.error("Connection Failed: " + err);
    console.trace(err);
    process.exitCode = 1;
});

function destroyOnExit() {
    console.log("Exiting program, destroying session.");
    client.destroy();
}

function loadInstalledPlugins() {
    let plugins = globby.sync(
        ['heralda-*'],
        {cwd: './node_modules', onlyFiles: false, absolute: true, deep: 0}
    );

    plugins.forEach(pluginPath => {
        let pluginData = require([pluginPath, 'package.json'].join('/'));
        if (!pluginData.keywords.includes('heralda-plugin')) {
            return;
        }

        let PluginClass = require(pluginPath);
        console.log('Starting ' + pluginData.name);
        plugins[pluginData.name] = new PluginClass(client, config.plugins[pluginData.name]);
    });
}
