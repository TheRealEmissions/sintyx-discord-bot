module.exports = class coins {
    constructor() {
        this.name = 'coins',
            this.alias = ["bal", "balance"],
            this.usage = '-coins [@user]',
            this.category = 'user',
            this.description = 'View yours or another\'s coin balance'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        if (!args[1]) {
            client.models.userProfiles.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                if (!db) {
                    return message.channel.send(`You have not sent a non-command message to this guild yet! Please do so before running the ${args[0]} command.`)
                }
                let embed = new client.modules.Discord.MessageEmbed()
                    .setDescription(`You currently have **${db.user_coins} Coins**!`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                message.channel.send(embed);
                new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
            });
        } else {
            let user = Boolean(message.mentions.users.first()) ? message.mentions.users.first() : message.guild.members.find(x => x.id == args[1].toString());
            client.models.userProfiles.findOne({
                "user_id": user.id
            }, (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                if (!db) {
                    return message.channel.send(`This user has not sent any messages to the Discord yet.`)
                }
                let embed = new client.modules.Discord.MessageEmbed()
                    .setDescription(`<@${user.id}> currently has **${db.user_coins} Coins**!`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                message.channel.send(embed);
                new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
            });
        }
    }
}
