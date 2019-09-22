module.exports = class pause {
    constructor() {
        this.name = 'pause',
            this.alias = [],
            this.usage = '-pause',
            this.category = 'music',
            this.description = 'Pause the currently playing music'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        let serverQueue = client.music.queue.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            message.channel.send(`${client.storage.emojiCharacters['pause']} Paused the music!`);
            return new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
        }
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
        return message.channel.send(`There is currently no music playing.`);
    }
}
