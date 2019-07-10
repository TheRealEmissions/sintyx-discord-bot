module.exports = class nowplaying {
    constructor() {
        this.name = 'nowplaying',
        this.alias = ['np'],
        this.usage = `-nowplaying`,
        this.category = 'misc',
        this.description = 'Check the currently playing song'
    }

    async run(client, message, args) {
        let serverQueue = client.music.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send(`There are currently no songs playing.`);
        return message.channel.send(`${client.storage.emojiCharacters['music']} Now playing: **${serverQueue.songs[0].title}**`);
    }
}