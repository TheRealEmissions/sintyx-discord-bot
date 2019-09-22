module.exports = class stats {
    constructor() {
        this.name = 'stats',
            this.alias = ["botinfo", "info", "statistics", "status"],
            this.usage = `-stats`,
            this.category = 'misc',
            this.description = 'View statistics regarding the bot and the server'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        let channelAmountGlobal = 0;
        client.guilds.forEach(guild => {
            channelAmountGlobal += guild.channels.size;
        });
        let userAmountGlobal = 0;
        client.guilds.forEach(guild => {
            userAmountGlobal += guild.memberCount;
        });

        function bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return 'N/A';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            if (i == 0) return bytes + ' ' + sizes[i];
            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        };
        let totalSeconds = (client.uptime / 1000);
        let days = Math.round(Math.floor(totalSeconds / 86400) * 100) / 100;
        let hours = Math.round(Math.floor(totalSeconds / 3600) * 100) / 100;
        totalSeconds %= 3600;
        let minutes = Math.round(Math.floor(totalSeconds / 60) * 100) / 100;
        let seconds = Math.round(totalSeconds % 60 * 100) / 100;
        let embed = new client.modules.Discord.MessageEmbed()
            .setTitle(`**${client.user.username} Bot Statistics**`)
            .setColor(message.guild.member(client.user).displayHexColor)
            .addField(`Channels`, `${message.guild.channels.size} *(${channelAmountGlobal} global)*`, true)
            .addField(`Users`, `${message.guild.memberCount} *(${userAmountGlobal} global)*`, true)
            .addField(`Emojis`, `${message.guild.emojis.array().length} *(${client.emojis.array().length} global)*`, true)
            .addField(`Memory Usage`, bytesToSize(process.memoryUsage().heapTotal), true)
            .addField(`Latency`, Math.round(client.ws.ping) + "ms", true)
            .addField(`Bot Uptime`, days !== 0 ? `${days}d ${hours}h ${minutes}m ${seconds}s` : (hours !== 0 ? `${hours}h ${minutes}m ${seconds}s` : (minutes !== 0 ? `${minutes}m ${seconds}s` : (seconds !== 0 ? `${seconds}s` : `0s`))), true)
        /*

        */

        let sbIP = `mc.sintyx.com`;
        let sbPort = `25565`;
        let url = `http://mcapi.us/server/status?ip=` + sbIP + `&port=` + sbPort;
        client.modules.request(url, (err, response, body) => {
            if (err) {
                new client.methods.log(client, message.guild).error(err);
                message.channel.send(new client.methods.errorEmbed(`${client.user.username} Server Statistics`, `ST001`, message.guild.member(client.user).displayHexColor));
            } else {
                body = JSON.parse(body);
                let embed2 = new client.modules.Discord.MessageEmbed()
                    .setTitle(`**${client.user.username} Server Statistics**`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .addField(`Server`, Boolean(body.online) ? `**Online** ${client.storage.emojiCharacters['white_check_mark']}\n${body.players.now}/${body.players.max} Players` : `**Offline** ${client.storage.emojiCharacters['x']}`)
                    .setTimestamp()
                message.channel.send(embed);
                message.channel.send(embed2);
            }
        });
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
