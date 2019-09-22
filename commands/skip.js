module.exports = class skip {
    constructor() {
        this.name = 'skip',
            this.alias = [],
            this.usage = '-skip',
            this.category = 'music',
            this.description = 'Skip the currently playing song'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        let serverQueue = client.music.queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send(`You are not currently in a voice channel.`);
        if (!serverQueue) return message.channel.send(`There are currently no songs in the queue nor playing to skip.`);
        serverQueue.connection.dispatcher.end(`Skip command has been used!`);
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
        return undefined;
    }
}
