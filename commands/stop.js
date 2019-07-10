module.exports = class stop {
    constructor() {
        this.name = 'stop',
        this.alias = [],
        this.usage = '-stop',
        this.category = 'misc',
        this.description = 'Stop the currently playing song'
    }

    async run(client, message, args) {
        let serverQueue = client.music.queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send(`You are not currently in a voice channel.`);
        if (!serverQueue) return message.channel.send(`There are currently no songs playing to stop.`);
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end(`Stop command has been used!`);
        return undefined;
    }
}