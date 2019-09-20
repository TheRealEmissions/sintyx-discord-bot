module.exports = class boosts {
    constructor() {
        this.name = 'boosts',
            this.alias = [],
            this.usage = '-boosts',
            this.category = 'user',
            this.description = 'View the currently active boosts!'
    }

    async run(client, message, args) {
        client.models.guildSettings.findOne({
            "guild_id": message.guild.id
        }, (err, db) => {
            if (err) return new client.methods.log(client).error(err);
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle(`Currently active boosts:`)
                .addField(`XP:`, db.xp_booster.length > 0 ? db.xp_booster.map(x => `${x.percent}% - <@${message.guild.members.get(x.user_id).id}>`) : ':x:', true)
                .addField(`Coin:`, db.coin_booster.length > 0 ? db.coin_booster.map(x => `${x.percent}% - <@${message.guild.members.get(x.user_id).id}>`) : ':x:', true)
            message.channel.send(embed);
        });
    }
}
