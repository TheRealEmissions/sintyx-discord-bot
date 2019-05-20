module.exports = class stats {
    constructor() {
        this.name = 'stats',
            this.alias = ["botinfo", "info"],
            this.usage = `=stats`
    }

    async run(client, message, args) {
        let embedColor = message.guild.member(client.user).displayHexColor;
        let channelAmount = 0;
        client.guilds.forEach(guild => {
            channelAmount = channelAmount + guild.channels.size;
        });
        let userAmount = 0;
        client.guilds.forEach(guild => {
            userAmount = userAmount + guild.memberCount;
        });
        function bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return 'N/A';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            if (i == 0) return bytes + ' ' + sizes[i];
            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        };
        let memoryUsage = bytesToSize(process.memoryUsage().heapTotal);
        let embed = new client.modules.Discord.MessageEmbed()
            .setTitle(`[${client.user.username} Statistics]`)
            .setColor(embedColor)
            .addField(`Channels`, channelAmount, true)
            .addField(`Users`, userAmount, true)
            .addField(`Memory Usage`, memoryUsage, true)
            .addField(`Latency`, Math.round(client.ws.ping) + "ms", true)
            .addField(`NodeJS Version`, process.version, true)
        message.channel.send(embed);
    }
}