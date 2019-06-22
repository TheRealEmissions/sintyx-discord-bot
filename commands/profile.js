module.exports = class profile {
    constructor() {
        this.name = 'profile',
        this.alias = [],
        this.usage = '-profile [@user]',
        this.category = 'user',
        this.description = 'View your profile or another user\'s profile!'
    }

    async run(client, message, args) {
        let user = Boolean(!args[1]) ? message.author : (Boolean(message.mentions.users.first()) ? message.mentions.users.first() : message.guild.members.find(x => x.id == args[1].toString()));
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
                    .setTitle(`**${user.username}${Boolean(user.username.endsWith('s')) ? `'` : `'s`}** Profile`)
                    .addField(`General Information`, client.storage.emojiCharacters[1], true)
                    .addField(`Settings Information`, client.storage.emojiCharacters[2], true)
                    .setColor(message.guild.member(client.user).displayHexColor)
                message.channel.send(embed).then(msg => {
                    msg.react(client.storage.emojiCharacters[1]).then(() => msg.react(client.storage.emojiCharacters[2]).then(() => msg.react(client.storage.emojiCharacters['x'])));
                    let filter = (reaction, user) => ((reaction.emoji.name == client.storage.emojiCharacters[1]) || (reaction.emoji.name == client.storage.emojiCharacters[2]) || (reaction.emoji.name == client.storage.emojiCharacters['x'])) && user.id == message.author.id;
                    let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    collector.on('collect', reaction => {
                        reaction.users.remove(message.author);
                        if (reaction.emoji.name == client.storage.emojiCharacters[1]) {
                            let average = profileDB.user_xp / profileDB.message_count;
                            let xpPerMsg = parseFloat(average.toFixed(2));
                            let embed = new client.modules.Discord.MessageEmbed()
                                .setTitle(`**${user.username}${Boolean(user.username.endsWith('s')) ? `'`: `'s`}** Profile - **General Information**`)
                                .addField(`Message Count`, profileDB.message_count, true)
                                .addField(`XP`, profileDB.user_xp, true)
                                .addField(`Average XP/msg`, xpPerMsg, true)
                                .addField(`Level`, profileDB.user_level + ` *(${profileDB.user_xp} / ${profileDB.user_level * 1000})*`, true)
                                .addField(`Coins`, profileDB.user_coins, true)
                                .addField(`Open Tickets`, `${Boolean(profileDB.open_tickets) ? profileDB.open_tickets.length : 0}`, true)
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
                            let xpPing;
                            let coinPing;
                            settingsDB.options.forEach(option => {
                                if (option.name == 'xp_ping') {
                                    xpPing = Boolean(option.boolean == true) ? true : false
                                }
                                if (option.name == 'coin_ping') {
                                    coinPing = Boolean(option.boolean == true) ? true : false
                                }
                            });
                            let embed = new client.modules.Discord.MessageEmbed()
                                .setTitle(`**${user.username}${Boolean(user.username.endsWith('s')) ? `'` : `'s`}** Profile - **Settings Information**`)
                                .addField(`XP Ping`, rebrandEmoji(xpPing), true)
                                .addField(`Coin Ping`, rebrandEmoji(coinPing), true)
                                .setColor(message.guild.member(client.user).displayHexColor)
                            msg.edit(embed);
                        } else if (reaction.emoji.name == client.storage.emojiCharacters['x']) {
                            collector.stop();
                            msg.delete().catch(err => console.error(err));
                            message.delete().catch(err => console.error(err));
                        }
                    })
                });
            })
        })
    }
}