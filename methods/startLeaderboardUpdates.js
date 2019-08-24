module.exports = class slu {
    constructor(client) {
        this.message = this.setMessage(client);
        this.log = require(`../methods`).log;
        this.init(client);
    }

    async setMessage(client) {
        return await client.channels.get(client.storage.messageCache['leaderboard'].channel).messages.fetch(client.storage.messageCache['leaderboard'].msg_id);
    }

    async init(client) {
        console.log(this.message);
        await this.leaderboardOne(client).catch(err => new this.log(client).error(err));
        await this.leaderboardTwo(client).catch(err => new this.log(client).error(err));
        await this.leaderboardThree(client).catch(err => new this.log(client).error(err));
        await this.leaderboardFour(client).catch(err => new this.log(client).error(err));
    }

    getXPLeaderboard(client) {
        return new Promise(async (resolve, reject) => {
            await client.models.userProfiles.find({}).sort(`-user_xp`).exec((err, result) => {
                if (err) return reject(err);
                if (!result.length) return reject(false);
                return resolve(result);
            });
        });
    }

    getCoinLeaderboard(client) {
        return new Promise(async (resolve, reject) => {
            await client.models.userProfiles.find({}).sort(`-user_coins`).exec((err, result) => {
                if (err) return reject(err);
                if (!result.length) return reject(false);
                return resolve(result);
            });
        });
    }

    getAvgXPLeaderboard(client) {
        return new Promise((resolve, reject) => {
            client.models.userProfiles.find({}).lean().exec(async (err, docs) => {
                if (err) return reject(err);
                let obj = {
                    users: []
                };
                for (const count in docs) {
                    if (count > docs.length) {
                        resolve(obj);
                        break;
                    }
                    obj.users.push({
                        user_id: docs[count].user_id,
                        avg_msg_xp: parseFloat((docs[count].user_xp / docs[count].message_count).toFixed(2))
                    });
                    obj.users = obj.users.sort((a, b) => b.avg_msg_xp - a.avg.msg.xp);
                }
            });
        });
    }

    getMsgCountLeaderboard(client) {
        return new Promise((resolve, reject) => {
            client.models.userProfiles.find({}).sort(`-message_count`).exec((err, result) => {
                if (err) return reject(err);
                if (!result.length) return reject(false);
                return resolve(result);
            });
        });
    }

    leaderboardOne(client) {
        return new Promise(async (resolve, reject) => {
            let embed = {
                embed: {
                    title: `**XP Leaderboard**: Top 9`,
                    color: this.message.guild.me.displayHexColor,
                    fields: [],
                    footer: {
                        text: `Page 1 of 4`
                    }
                }
            }
            let lb = await this.getXPLeaderboard(client).catch(err => reject(err));
            for (const count in lb) {
                if (count >= 10) {
                    this.message.edit(embed);
                    setTimeout(() => resolve(), 15000);
                    break;
                }
                let userid = lb[count].user_id,
                    user = await client.users.fetch(userid);
                embed.embed.fields.push({
                    name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator} || *Level ${lb[count].user_level}*`,
                    value: `${lb[count].user_xp} / ${Number(lb[count].user_level) * 1000}`,
                    inline: false
                });
            }
        });
    }

    leaderboardTwo(client) {
        return new Promise(async (resolve, reject) => {
            let embed = {
                embed: {
                    title: `**Coin Leaderboard**: Top 9`,
                    color: this.message.guild.me.displayHexColor,
                    fields: [],
                    footer: {
                        text: `Page 2 of 4`
                    }
                }
            }
            let lb = await this.getCoinLeaderboard(client).catch(err => reject(err));
            for (const count in lb) {
                if (count >= 10) {
                    this.message.edit(embed);
                    setTimeout(() => resolve(), 15000);
                    break;
                }
                let userid = this.lb[count].user_id;
                let user = await client.users.fetch(userid);
                embed.embed.fields.push({
                    name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                    value: `${lb[count].user_coins}`,
                    inline: false
                });
            }
        });
    }

    leaderboardThree(client) {
        return new Promise((resolve, reject) => {
            let embed = {
                embed: {
                    title: `**Avg. XP/msg Leaderboard**: Top 9`,
                    color: this.message.guild.me.displayHexColor,
                    fields: [],
                    footer: {
                        text: `Page 3 of 4`
                    }
                }
            }
            this.getAvgXPLeaderboard(client).then(async (lb) => {
                for (const count in lb.users) {
                    if (count >= 10) {
                        this.message.edit(embed);
                        setTimeout(() => resolve(), 15000);
                        break;
                    }
                    let userid = await lb.users[count].user_id;
                    let user = await client.users.fetch(userid);
                    embed.embed.fields.push({
                        name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                        value: `${obj.users[count].avg_msg_xp}`,
                        inline: false
                    });
                }
            }).catch(err => reject(err));
        });
    }

    leaderboardFour(client) {
        return new Promise(async (resolve, reject) => {
            let embed = {
                embed: {
                    title: `**Message Count Leaderboard**: Top 9`,
                    color: this.message.guild.me.displayHexColor,
                    fields: [],
                    footer: {
                        text: `Page 4 of 4`
                    }
                }
            }
            let lb = await this.getMsgCountLeaderboard(client).catch(err => new this.log(client).error(err));
            for (const count in lb) {
                if (count >= 10) {
                    this.message.edit(embed);
                    setTimeout(() => {
                        resolve();
                        this.init();
                    }, 15000);
                    break;
                }
                let userid = await lb[count].user_id;
                let user = await client.users.fetch(userid);
                embed.embed.fields.push({
                    name: "`" + `#${i}` + "`" + ` ${user.username}#${user.discriminator}`,
                    value: `${lb[count].message_count}`,
                    inline: false
                });
            }
        });
    }
}
