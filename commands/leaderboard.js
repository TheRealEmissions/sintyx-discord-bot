module.exports = class leaderboard {
    constructor() {
        this.name = 'leaderboard',
            this.usage = '-leaderboard',
            this.alias = ['lb', 'xptop', 'cointop'],
            this.category = 'user',
            this.description = 'View the top 10 users of either XP or coins'
    }

    async run(client, message, args) {
        let embed = new client.modules.Discord.MessageEmbed()
            .setColor(message.guild.member(client.user).displayHexColor)
            .addField(`XP Leaderboard`, client.storage.emojiCharacters[1], true)
            .addField(`Coin Leaderboard`, client.storage.emojiCharacters[2], true)
            .addField(`Avg. XP/msg Leaderboard`, client.storage.emojiCharacters[3], true)
            .addField(`Message Count Leaderboard`, client.storage.emojiCharacters[4], true)
        message.channel.send(embed).then(msg => {
            msg.react(client.storage.emojiCharacters[1]).then(() => msg.react(client.storage.emojiCharacters[2]).then(() => msg.react(client.storage.emojiCharacters[3]).then(() => msg.react(client.storage.emojiCharacters[4]))).then(() => msg.react(client.storage.emojiCharacters['x'])));
            let filter = (reaction, user) => ((reaction.emoji.name == client.storage.emojiCharacters[1]) || (reaction.emoji.name == client.storage.emojiCharacters[2]) || (reaction.emoji.name == client.storage.emojiCharacters[3]) || (reaction.emoji.name == client.storage.emojiCharacters[4]) || (reaction.emoji.name == client.storage.emojiCharacters['x'])) && user.id == message.author.id;
            let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
            collector.on('collect', async (reaction) => {
                if (reaction.emoji.name == client.storage.emojiCharacters[1]) {
                    reaction.users.remove(reaction.users.last());
                    let embed2 = {
                        embed: {
                            title: `**XP Leaderboard**: Top 9`,
                            color: message.guild.member(client.user).displayHexColor,
                            fields: []
                        }
                    }
                    let i = 1;

                    function leaderboardFunc() {
                        return new Promise(async (resolve, reject) => {
                            await client.models.userProfiles.find({}).sort(`-user_xp`).exec((err, result) => {
                                if (err) return reject(console.error(err));
                                if (!result.length) return resolve(false);
                                return resolve(result);
                            });
                        });
                    }
                    let leaderboard = await leaderboardFunc();
                    for (let count in leaderboard) {
                        if (i >= 10) {
                            end();
                            break;
                        }
                        let userid = leaderboard[count].user_id;
                        let user = await Promise.resolve(client.users.fetch(userid));
                        embed2.embed.fields.push({
                            name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator} || *Level ${leaderboard[count].user_level}*`,
                            value: `${leaderboard[count].user_xp} / ${Number(leaderboard[count].user_level) * 1000}`,
                            inline: false
                        });
                        i++;
                    }

                    function end() {
                        msg.edit(embed2);
                    }
                }
                if (reaction.emoji.name == client.storage.emojiCharacters[2]) {
                    reaction.users.remove(reaction.users.last());
                    let embed2 = {
                        embed: {
                            title: `**Coin Leaderboard**: Top 9`,
                            color: message.guild.member(client.user).displayHexColor,
                            fields: []
                        }
                    }
                    let i = 1;

                    function leaderboardFunc() {
                        return new Promise(async (resolve, reject) => {
                            await client.models.userProfiles.find({}).sort(`-user_coins`).exec((err, result) => {
                                if (err) return reject(console.error(err));
                                if (!result.length) return resolve(false);
                                return resolve(result);
                            });
                        });
                    }
                    let leaderboard = await leaderboardFunc();
                    for (let count in leaderboard) {
                        if (i >= 10) {
                            end();
                            break;
                        }
                        let userid = leaderboard[count].user_id;
                        let user = await Promise.resolve(client.users.fetch(userid));
                        embed2.embed.fields.push({
                            name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                            value: `${leaderboard[count].user_coins}`,
                            inline: false
                        });
                        i++;
                    }

                    function end() {
                        msg.edit(embed2);
                    }
                }
                if (reaction.emoji.name == client.storage.emojiCharacters[3]) {
                    reaction.users.remove(reaction.users.last());
                    let embed2 = {
                        embed: {
                            title: `**Avg. XP/msg Leaderboard**: Top 9`,
                            color: message.guild.member(client.user).displayHexColor,
                            fields: []
                        }
                    }
                    client.models.userProfiles.find({}).lean().exec(async (err, docs) => {
                        if (err) return console.error(err);
                        let obj = {
                            users: []
                        };
                        docs.forEach(doc => {
                            obj.users.push({
                                user_id: doc.user_id,
                                avg_msg_xp: parseFloat((doc.user_xp / doc.message_count).toFixed(2))
                            });
                        });
                        obj.users = obj.users.sort((a, b) => b.avg_msg_xp - a.avg_msg_xp);
                        let i = 1;
                        for (let count in obj.users) {
                            if (i >= 10) {
                                end();
                                break;
                            }
                            let userid = await obj.users[count].user_id;
                            let user = await Promise.resolve(client.users.fetch(userid));
                            embed2.embed.fields.push({
                                name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                                value: `${obj.users[count].avg_msg_xp}`,
                                inline: false
                            });
                            i++;
                        }

                        function end() {
                            msg.edit(embed2);
                        }
                    });
                }
                if (reaction.emoji.name == client.storage.emojiCharacters[4]) {
                    reaction.users.remove(reaction.users.last());
                    let embed2 = {
                        embed: {
                            title: `**Message Count Leaderboard**: Top 9`,
                            color: message.guild.member(client.user).displayHexColor,
                            fields: []
                        }
                    }
                    function leaderboardFunc() {
                        return new Promise(async (resolve, reject) => {
                            await client.models.userProfiles.find({}).sort(`-message_count`).exec((err, result) => {
                                if (err) return reject(console.error(err));
                                if (!result.length) return reject(false);
                                return resolve(result);
                            });
                        });
                    }
                    let leaderboard = await leaderboardFunc();
                    let i = 1;
                    for (let count in leaderboard) {
                        if (i >= 10) {
                            end();
                            break;
                        }
                        let userid = await leaderboard[count].user_id;
                        let user = await Promise.resolve(client.users.fetch(userid));
                        embed2.embed.fields.push({
                            name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                            value: `${leaderboard[count].message_count}`,
                            inline: false
                        });
                        i++
                    }
                    function end() {
                        msg.edit(embed2);
                    }
                }
                if (reaction.emoji.name == client.storage.emojiCharacters['x']) {
                    collector.stop();
                    message.delete();
                    msg.delete();
                }
            });
        });
    }
}