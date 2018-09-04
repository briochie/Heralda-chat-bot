const Discord = require('discord.js');
const Responder = require("./responder.js");

class HeraldaPlugin {
  constructor(client) {
    this.client = client;
    this.responder = new Responder(client);
  }
}

module.exports = HeraldaPlugin;
