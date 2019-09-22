module.exports = class queue {
    constructor() {
        this.name = 'queue',
            this.alias = ['q'],
            this.usage = '-queue',
            this.category = 'music',
            this.description = 'View the current queue for songs'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        let serverQueue = client.music.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send(`There are currently no songs playing`);
        let index = 0;
        let embed = new client.modules.Discord.MessageEmbed()
            .setColor(message.guild.member(client.user).displayHexColor)
            .addField(`Song`, serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join(`\n`), true)
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
        return message.channel.send(embed);
    }
}
