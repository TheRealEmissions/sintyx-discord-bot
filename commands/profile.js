module.exports = class profile {
    constructor() {
        this.name = 'profile',
        this.alias = [],
        this.usage = '-profile [@user]',
        this.category = 'user',
        this.description = 'View your profile or another user\'s profile!'
    }

    async run(client, message, args) {
        let user = Boolean(!args[0]) ? message.author : (Boolean(message.mentions.users.first()) ? message.mentions.users.first() : message.guild.members.find(x => x.id == args[1].toString()));
        client.models.userProfiles.findOne({
            "user_id": user.id
        }, (err, profileDB) => {
            client.models.userSettings.findOne({
                "user_id": user.id
            }, (err2, settingsDB) => {
                if (err) return console.error(err);
                if (err2) return console.error(err2);
                if (!profileDB) {
                    return console.log(`[ERROR] Profile database not found ${new Date()}`)
                }
                if (!settingsDB) {
                    return console.log(`[ERROR] Settings database not found ${new Date()}`)
                }
                let embed = new client.modules.Discord.MessageEmbed()
                    .setTitle(`**${user.tag}${Boolean(user.tag.endsWith('s')) ? `'` : `'s`}** Profile`)
                    .addField(`General Information`, client.storage.emojiCharacters[1])
                    .addField(`Settings Information`, client.storage.emojiCharacters[2])
                    .setColor(message.guild.member(client.user).displayHexColor)
                message.channel.send(embed).then(msg => {
                    let filter = (reaction, user) => ((reaction.emoji.name == client.storage.emojiCharacters[1]) || (reaction.emoji.name == client.storage.emojiCharacters[2]) || (reaction.emoji.name == client.storage.emojiCharacters['x'])) && user.id == message.author.id;
                    let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    collector.on('collect', reaction => {
                        reaction.users.remove(message.author);
                        if (reaction.emoji.name == client.storage.emojiCharacters[1]) {
                            let embed = new client.modules.Discord.MessageEmbed()
                                .setTitle(`**${user.tag}${Boolean(user.tag.endsWith('s')) ? `'`: `'s`}** Profile`)
                                .addField(`XP`, profileDB.user_xp)
                                .addField(`Level`, profileDB.user_level + `*(${db.user_xp} / ${db.user_level * 1000})*`)
                                .addField(`Coins`, profileDB.user_coins)
                                .setColor(message.guild.member(client.user).displayHexColor)
                            msg.edit(embed);
                        } else if (reaction.emoji.name == client.storage.emojiCharacters[2]) {
                            function rebrandEmoji(boolean) {
                                if (boolean == true) {
                                    return client.storage.emojiCharacters['white_check_mark'];
                                } else {
                                    return client.storage.emojiCharacters['x'];
                                }
                            }
                            let embed = new client.modules.Discord.MessageEmbed()
                                .setTitle(`**${user.tag}${Boolean(user.tag.endsWith('s')) ? `'` : `'s`}** Profile`)
                                .addField(`XP Ping`, rebrandEmoji(settingsDB.xp_ping))
                                .addField(`Coin Ping`, rebrandEmoji(settingsDB.coin_ping))
                                .setColor(message.guild.member(client.user).displayHexColor)
                            msg.edit(embed);
                        } else if (reaction.emoji.name == client.storage.emojiCharacters['x']) {
                            collector.stop();
                            msg.delete();
                            message.delete();
                        }
                    })
                });
            })
        })
    }
}