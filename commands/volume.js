module.exports = class volume {
    constructor() {
        this.name = 'volume',
            this.alias = [],
            this.usage = '-volume',
            this.category = 'music',
            this.description = 'Alter the volume of the music'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        let serverQueue = client.music.queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send(`You are not currently in a voice channel.`);
        if (!serverQueue) return message.channel.send(`I cannot alter the volume of nothing!`);
        if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
        return message.channel.send(`Altered the volume to: **${args[1]}**`);
    }
}
