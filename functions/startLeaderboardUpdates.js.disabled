module.exports = async (client) => {
    let message = await client.channels.get(`${client.storage.messageCache['leaderboard'].channel}`).messages.fetch(client.storage.messageCache['leaderboard'].msg_id);
    async function leaderboardOne(_callback) {
        let embed = {
            embed: {
                title: `**XP Leaderboard**: Top 9`,
                color: message.guild.member(client.user).displayHexColor,
                fields: [],
                footer: {
                    text: `Page 1 of 4`
                }
            }
        }
        let i = 1;
        function leaderboardFunc() {
            return new Promise(async (resolve, reject) => {
                await client.models.userProfiles.find({}).sort(`-user_xp`).exec((err, result) => {
                    if (err) return reject(console.error(err));
                    if (!result.length) return resolve(false);
                    return resolve(result);
                })
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
            embed.embed.fields.push({
                name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator} || *Level ${leaderboard[count].user_level}*`,
                value: `${leaderboard[count].user_xp} / ${Number(leaderboard[count].user_level) * 1000}`,
                inline: false
            });
            i++;
        }
        function end() {
            message.edit(embed);
            _callback();
        }
    }
    async function leaderboardTwo(_callback) {
        let embed = {
            embed: {
                title: `**Coin Leaderboard**: Top 9`,
                color: message.guild.member(client.user).displayHexColor,
                fields: [],
                footer: {
                    text: `Page 2 of 4`
                }
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
            embed.embed.fields.push({
                name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                value: `${leaderboard[count].user_coins}`,
                inline: false
            });
            i++;
        }
        function end() {
            message.edit(embed);
            _callback();
        }
    }
    async function leaderboardThree(_callback) {
        let embed = {
            embed: {
                title: `**Avg. XP/msg Leaderboard**: Top 9`,
                color: message.guild.member(client.user).displayHexColor,
                fields: [],
                footer: {
                    text: `Page 3 of 4`
                }
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
                embed.embed.fields.push({
                    name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                    value: `${obj.users[count].avg_msg_xp}`,
                    inline: false
                });
                i++;
            }
            function end() {
                message.edit(embed);
                _callback();
            }
        })
    }
    async function leaderboardFour() {
        let embed = {
            embed: {
                title: `**Message Count Leaderboard**: Top 9`,
                color: message.guild.member(client.user).displayHexColor,
                fields: [],
                footer: {
                    text: `Page 4 of 4`
                }
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
            embed.embed.fields.push({
                name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                value: `${leaderboard[count].message_count}`,
                inline: false
            });
            i++;
        }
        function end() {
            message.edit(embed);
            setTimeout(() => {
                init();
            }, 15000);
        }
    }

    function init() {
        leaderboardOne(function() {
            setTimeout(() => {
                leaderboardTwo(function() {
                    setTimeout(() => {
                        leaderboardThree(function() {
                            setTimeout(() => {
                                leaderboardFour();
                            }, 15000);
                        });
                    }, 15000);
                });
            }, 15000);
        });
    }

    init();
}