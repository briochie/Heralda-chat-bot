# Heralda, the helpful Discord Herald Bot

Heralda is a chat bot that announces the arrival of new users to voice channels in Discord. She uses voicerss.org to retrieve text-to-speech voice clips, which she then plays in the voice channel.

## Features

* Announces user arrivals and exits.

## Features in the Future

* Customizable user join and exit messages for each server.
* Customizable "welcome" messages for Heralda when she joins a voice channel.
* Easier customization for language/audio settings.

## Installing Heralda

To use Heralda, you will need:

* A token from Discord.
* An api key from http://www.voicerss.org.

After getting these, create a file in the root directory called `_config.json`. Add your keys to that file:

```json
{
  "token": "[DISCORD TOKEN]",
  "plugins": {
    "heralda-plugin-voice": {
      "voiceApiKey": "[VOICERSS TOKEN]"
    }
  }
}

```

After that, run `npm install` and `npm start`, and Heralda will be up and running. Invite her to your Discord server as you would any other bot.

### Installing on Windows

Since Discord.js prefers to use `node-opus`, you will need to install the windows build tools: https://github.com/felixrieseberg/windows-build-tools

### Adding Plugins

By default, Heralda will install the voice plugin, so she can announce users as they enter the voice channel. You can install other plugins using npm, and Heralda will automatically activate these plugins on startup. All you need to do is use `npm install`.
