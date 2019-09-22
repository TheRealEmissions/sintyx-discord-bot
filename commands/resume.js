module.exports = class resume {
    constructor() {
        this.name = 'resume',
            this.alias = [],
            this.usage = '-resume',
            this.category = 'music',
            this.description = 'Resume the paused music'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        let serverQueue = client.music.queue.get(message.guild.id);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
            return message.channel.send(`${client.storage.emojiCharacters['play']} Resumed the music!`);
        }
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
        return message.channel.send(`There is currently no music playing.`);
    }
}
