module.exports = class resume {
    constructor() {
        this.name = 'resume',
        this.alias = [],
        this.usage = '-resume',
        this.category = 'music',
        this.description = 'Resume the paused music'
    }

    async run(client, message, args) {
        let serverQueue = client.music.queue.get(message.guild.id);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send(`${client.storage.emojiCharacters['play']} Resumed the music!`);
        }
        return message.channel.send(`There is currently no music playing.`);
    }
}