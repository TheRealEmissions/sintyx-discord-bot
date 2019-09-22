module.exports = class nowplaying {
    constructor() {
        this.name = 'nowplaying',
            this.alias = ['np'],
            this.usage = `-nowplaying`,
            this.category = 'music',
            this.description = 'Check the currently playing song'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        let serverQueue = client.music.queue.get(message.guild.id);
        if (!serverQueue) {
            new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
            return message.channel.send(`There are currently no songs playing.`);
        }
        message.channel.send(`${client.storage.emojiCharacters['music']} Now playing: **${serverQueue.songs[0].title}**`);
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
        return;
    }
}
