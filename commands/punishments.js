module.exports = class punishments {
    constructor() {
        this.name = 'punishments',
            this.usage = '-punishments [id]',
            this.alias = ['punishment', 'bans', 'mutes', 'kicks'],
            this.category = 'user',
            this.description = 'View your punishments list and the details behind the punishment'
    }

    async run(client, message, args) {
        /*

        types:

        Blacklist
        Mute
        Kick
        Warn

        */
        if (!args[1]) {
            client.models.userProfiles.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                if (!db) return;
                if (!db.punishment_history) {
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setDescription(`You currently have no punishments on your account! Well done! ${client.storage.emojiCharacters['clap']}`)
                        .setColor(message.guild.member(client.user).displayHexColor)
                    return message.channel.send(embed);
                }
                client.models.userProfiles.find({
                    "user_id": message.author.id
                }).lean().exec((err, docs) => {
                    if (err) return new client.methods.log(client, message.guild).error(err);
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`List of Punishments for **${message.author.tag}**:`)
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .addField(`Blacklists:`, Boolean(docs[0].punishment_history.filter(x => x.type == "Blacklist").length > 0) ? docs[0].punishment_history.filter(x => x.type == "Blacklist").map(r => `${r.id}`).join(`\n`) : `None`, true)
                        .addField(`Kicks:`, Boolean(docs[0].punishment_history.filter(x => x.type == "Kick").length > 0) ? docs[0].punishment_history.filter(x => x.type == "Kick").map(r => `${r.id}`).join(`\n`) : `None`, true)
                        .addField(`Warns:`, Boolean(docs[0].punishment_history.filter(x => x.type == "Warn").length > 0) ? docs[0].punishment_history.filter(x => x.type == "Warn").map(r => `${r.id}`).join(`\n`) : `None`, true)
                    message.channel.send(embed);
                });
            });
        } else if (args[1]) {
            if (!message.mentions.users.first()) {
                client.models.userProfiles.find({
                    "user_id": message.author.id
                }).lean().exec((err, docs) => {
                    if (err) return new client.methods.log(client, message.guild).error(err);
                    if (docs[0].punishment_history.filter(x => x.id == args[1]).length > 0) {
                        let entry = docs[0].punishment_history.filter(x => x.id == args[1]);
                        let embed;
                        if (entry.map(r => r.duration)[0] === null) {
                            embed = new client.modules.Discord.MessageEmbed()
                                .setTitle(`Punishment ID **${args[1]}**:`)
                                .setColor(message.guild.member(client.user).displayHexColor)
                                .addField(`Type:`, entry.map(r => `${r.type}`), true)
                                .addField(`Moderator:`, `<@${entry.map(r => r.moderator_id)}>\n*(${entry.map(r => r.moderator_id)})*`, true)
                                .addField(`Date:`, new Date(entry.map(r => r.date)), true)
                                .addField(`Reason:`, "```" + entry.map(r => r.reason) + "```", true)
                        } else {
                            embed = new client.modules.Discord.MessageEmbed()
                                .setTitle(`Punishment ID **${args[1]}**:`)
                                .setColor(message.guild.member(client.user).displayHexColor)
                                .addField(`Type:`, entry.map(r => `${r.type}`), true)
                                .addField(`Duration:`, entry.map(r => `${r.duration}`), true)
                                .addField(`Moderator:`, `<@${entry.map(r => r.moderator_id)}>\n*(${entry.map(r => r.moderator_id)})*`, true)
                                .addField(`Date:`, new Date(entry.map(r => r.date)), true)
                                .addField(`Reason:`, "```" + entry.map(r => r.reason) + "```", true)
                        }
                        message.channel.send(embed);
                    } else {
                        message.channel.send(`Unfortunately, I could not find the punishment ID **${args[1]}**!`)
                    }
                });
            } else {
                if (message.member.roles.find(x => x.name == "Owner")) {
                    if (args[2]) {
                        client.models.userProfiles.find({
                            "user_id": message.mentions.users.first().id
                        }).lean().exec((err, docs) => {
                            if (err) return new client.methods.log(client, message.guild).error(err);
                            if (docs[0].punishment_history.filter(x => x.id == args[2]).length > 0) {
                                let entry = docs[0].punishment_history.filter(x => x.id == args[2]);
                                let embed;
                                if (entry.map(r => r.duration)[0] === null) {
                                    embed = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`Punishment ID **${args[2]}**:`)
                                        .setColor(message.guild.member(client.user).displayHexColor)
                                        .addField(`Type:`, entry.map(r => `${r.type}`), true)
                                        .addField(`Moderator:`, `<@${entry.map(r => r.moderator_id)}>\n*(${entry.map(r => r.moderator_id)})*`, true)
                                        .addField(`Date:`, new Date(entry.map(r => r.date)), true)
                                        .addField(`Reason:`, "```" + entry.map(r => r.reason) + "```", true)
                                } else {
                                    embed = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`Punishment ID **${args[2]}**:`)
                                        .setColor(message.guild.member(client.user).displayHexColor)
                                        .addField(`Type:`, entry.map(r => `${r.type}`), true)
                                        .addField(`Duration`, entry.map(r => `${r.duration}`), true)
                                        .addField(`Moderator:`, `<@${entry.map(r => r.moderator_id)}>\n*(${entry.map(r => r.moderator_id)})*`, true)
                                        .addField(`Date:`, new Date(entry.map(r => r.date)), true)
                                        .addField(`Reason:`, "```" + entry.map(r => r.reason) + "```", true)
                                }
                                message.channel.send(embed);
                            } else {
                                message.channel.send(`Unfortunately, I could not find the punishment ID **${args[2]}** on <@${message.mentions.users.first().id}>${message.mentions.users.first().username.endsWith(`s`) ? `'` : `'s`} profile.`)
                            }
                        });
                    } else {
                        client.models.userProfiles.findOne({
                            "user_id": message.mentions.users.first().id
                        }, (err, db) => {
                            if (err) return new client.methods.log(client, message.guild).error(err);
                            if (!db) return;
                            client.models.userProfiles.find({
                                "user_id": message.mentions.users.first().id
                            }).lean().exec((err, docs) => {
                                if (docs[0].punishment_history) {
                                    if (err) return new client.methods.log(client, message.guild).error(err);
                                    let embed = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`List of Punishments for **${message.mentions.users.first().tag}**:`)
                                        .setColor(message.guild.member(client.user).displayHexColor)
                                        .addField(`Blacklists:`, Boolean(docs[0].punishment_history.filter(x => x.type == "Blacklist").length > 0) ? docs[0].punishment_history.filter(x => x.type == "Blacklist").map(r => `${r.id}`).join(`\n`) : `None`, true)
                                        .addField(`Kicks:`, Boolean(docs[0].punishment_history.filter(x => x.type == "Kick").length > 0) ? docs[0].punishment_history.filter(x => x.type == "Kick").map(r => `${r.id}`).join(`\n`) : `None`, true)
                                        .addField(`Warns:`, Boolean(docs[0].punishment_history.filter(x => x.type == "Warn").length > 0) ? docs[0].punishment_history.filter(x => x.type == "Warn").map(r => `${r.id}`).join(`\n`) : `None`, true)
                                    message.channel.send(embed);
                                } else {
                                    let embed = new client.modules.Discord.MessageEmbed()
                                        .setDescription(`<@${message.mentions.users.first().id}> currently has no punishments on their account!`)
                                        .setColor(message.guild.member(client.user).displayHexColor)
                                    return message.channel.send(embed);
                                }
                            });
                        });
                    }
                }
            }
        }
    }
}