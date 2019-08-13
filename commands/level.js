module.exports = class level {
    constructor() {
        this.name = 'level',
        this.alias = [],
        this.usage = '-level [@user]',
        this.category = 'user',
        this.description = 'View yours or another\'s level'
    }

    async run(client, message, args) {
        if (!args[1]) {
            client.models.userProfiles.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                if (!db) {
                    return message.channel.send(`You have not sent a non-command message to this guild yet! Please do so before running the ${args[0]} command.`)
                }
                let embed = new client.modules.Discord.MessageEmbed()
                    .setDescription(`You are currently **Level ${db.user_level}** *(${db.user_xp}/${db.user_level * 1000})*`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                message.channel.send(embed);
            })
        } else {
            let user = Boolean(message.mentions.users.first()) ? message.mentions.users.first() : message.guild.members.find(x => x.id == args[1].toString());
            client.models.userProfiles.findOne({
                "user_id": user.id
            }, (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                if (!db) {
                    return message.channel.send(`This user has not sent any messages to this Discord yet.`)
                }
                let embed = new client.modules.Discord.MessageEmbed()
                    .setDescription(`<@${user.id}> is currently **Level ${db.user_level}** *(${db.user_xp}/${db.user_level * 1000})*`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                message.channel.send(embed);
            });
        }
    }
}