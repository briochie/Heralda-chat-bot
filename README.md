# Heralda, the helpful Discord Herald Bot

Heralda is a chat bot that announces the arrival of new users to voice channels in Discord. She uses voicerss.org to retrieve text-to-speech voice clips, which she then plays in the voice channel.

## Features

* Announces user arrivals and exits.
* Customizable user join and exit messages for each server.
* Customizable "welcome" messages for Heralda when she joins a voice channel.

## Bot Commands

Heralda's commands are driven by her plugins. By default, she comes with [heralda-voice-plugin](https://github.com/EbekFrostblade/Heralda-voice-plugin) in the dependencies. Check out that repo for documentation on her commands and API, as well as additional custom configuration options.

## Installing Heralda

To use Heralda, you will need:

* NodeJS v8+ (I use v10.5.0)
* npm (I use 6.4.1)
* A token from Discord.
* An api key from http://www.voicerss.org.

Create a file in the root directory called `_config.json`. Add your keys to that file:

```json
{
  "token": "[DISCORD TOKEN]",
  "plugins": {
    "heralda-voice-plugin": {
      "voice": {
        apiKey: "[VOICERSS TOKEN]"
      }
    }
  }
}

```

After that, run `npm install` and `npm start`, and Heralda will be up and running. Invite her to your Discord server as you would any other bot. Heralda will need permissions to send messages, connect, and speak in order for her to perform her duties.

To stop the process, run `npm stop`.

### Installing on Windows

Since Discord.JS prefers to use `node-opus` (and therefore, so do we), you will need to install the [Windows build tools](https://github.com/felixrieseberg/windows-build-tools). These can be difficult to get configured properly, so be sure to read the documentation, and be sure you have the right Visual Studio version/packages installed.

### Adding Plugins

You can install other plugins using npm, and Heralda will automatically activate these plugins on startup. All you need to do is use `npm install`. When making your own plugin, make sure their name begins with `heralda-`.
