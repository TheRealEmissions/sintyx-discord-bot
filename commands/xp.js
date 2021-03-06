module.exports = class xp {
    constructor() {
        this.name = 'xp',
            this.alias = ['exp'],
            this.usage = '-xp [@user]',
            this.category = 'user',
            this.description = 'View yours or another\'s XP balance'
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
                let xpaway = (db.user_level * 1000) - db.user_xp;
                let embed = new client.modules.Discord.MessageEmbed()
                    .setDescription(`You currently have **${db.user_xp} XP**! You are currently ${xpaway} XP from levelling up.`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                message.channel.send(embed);
            });
        } else {
            let user = Boolean(message.mentions.users.first()) ? message.mentions.users.first() : message.guild.members.find(x => x.id == args[1].toString());
            if (!user) return;
            client.models.userProfiles.findOne({
                "user_id": user.id
            }, (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                if (!db) {
                    return message.channel.send(`This user has not sent any messages to the Discord yet.`)
                }
                let xpaway = (db.user_level * 1000) - db.user_xp;
                let embed = new client.modules.Discord.MessageEmbed()
                    .setDescription(`<@${user.id}> currently has **${db.user_xp} XP**! They are currently ${xpaway} XP from levelling up.`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                message.channel.send(embed);
            });
        }
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
