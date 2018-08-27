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

After getting these, create a file in the root directory called `_connectionConfig.json`. Add your keys to that file:

```json
{
    "token": "[DISCORD TOKEN]",
    "voiceApiKey": "[VOICERSS TOKEN]"
}

```

After that, run `npm install` and `npm start`, and Heralda will be up and running. Invite her to your Discord server as you would any other bot.
