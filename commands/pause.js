module.exports = class pause {
    constructor() {
        this.name = 'pause',
        this.alias = [],
        this.usage = '-pause',
        this.category = 'misc',
        this.description = 'Pause the currently playing music'
    }

    async run(client, message, args) {
        let serverQueue = client.music.queue.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send(`${client.storage.emojiCharacters['pause']} Paused the music!`);
        }
        return message.channel.send(`There is currently no music playing.`);
    }
}