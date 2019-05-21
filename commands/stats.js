module.exports = class stats {
    constructor() {
        this.name = 'stats',
            this.alias = ["botinfo", "info", "statistics", "status"],
            this.usage = `-stats`
    }

    async run(client, message, args) {
        let embedColor = message.guild.member(client.user).displayHexColor;
        let channelAmountGlobal = 0;
        client.guilds.forEach(guild => {
            channelAmountGlobal = channelAmountGlobal + guild.channels.size;
        });
        let userAmountGlobal = 0;
        client.guilds.forEach(guild => {
            userAmountGlobal = userAmountGlobal + guild.memberCount;
        });

        function bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return 'N/A';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            if (i == 0) return bytes + ' ' + sizes[i];
            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        };
        let memoryUsage = bytesToSize(process.memoryUsage().heapTotal);
        let totalSeconds = (client.uptime / 1000);
        let days = Math.round(Math.floor(totalSeconds / 86400) * 100) / 100;
        let hours = Math.round(Math.floor(totalSeconds / 3600) * 100) / 100;
        totalSeconds %= 3600;
        let minutes = Math.round(Math.floor(totalSeconds / 60) * 100) / 100;
        let seconds = Math.round(totalSeconds % 60 * 100) / 100;
        let time;
        if (days !== 0) {
            time = `${days}d ${hours}h ${minutes}m ${seconds}s`
        } else if (hours !== 0) {
            time = `${hours}h ${minutes}m ${seconds}s`
        } else if (minutes !== 0) {
            time = `${minutes}m ${seconds}s`
        } else if (seconds !== 0) {
            time = `${seconds}s`
        }
        let embed = new client.modules.Discord.MessageEmbed()
            .setTitle(`**${client.user.username} Bot Statistics**`)
            .setColor(embedColor)
            .addField(`Channels`, `${message.guild.channels.size} *(${channelAmountGlobal} global)*`, true)
            .addField(`Users`, `${message.guild.memberCount} *(${userAmountGlobal} global)*`, true)
            .addField(`Emojis`, `${message.guild.emojis.array().length} *(${client.emojis.array().length} global)*`, true)
            .addField(`Memory Usage`, memoryUsage, true)
            .addField(`Latency`, Math.round(client.ws.ping) + "ms", true)
            .addField(`Bot Uptime`, time, true)
        /*

        */

        let sbIP = `unitedrealm.co.uk`;
        let sbPort = `25565`;
        let url = `http://mcapi.us/server/status?ip=` + sbIP + `&port=` + sbPort;
        let status;
        client.modules.request(url, (err, response, body) => {
            if (err) console.error(err);
            body = JSON.parse(body);
            if (body.online) {
                status = `**Online** :white_check_mark:\n${body.players.now}/${body.players.max} players`
            } else {
                status = '**Offline** :x:'
            }
            let embed2 = new client.modules.Discord.MessageEmbed()
                .setTitle(`**${client.user.username} Server Statistics** - ${sbIP}`)
                .setColor(embedColor)
                .addField(`Skyblock`, status)
                .setTimestamp()
            message.channel.send(embed);
            message.channel.send(embed2);
        });
    }
}