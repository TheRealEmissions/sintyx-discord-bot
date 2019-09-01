class helpers {
    constructor() {};

    getAchievementObject(client, type) {
        return new Promise((resolve, reject) => {
            return resolve(client.storage.achievements.find(x => x.name == type));
        });
    }

    getAchievementData(client, type, name) {
        return new Promise((resolve, reject) => {
            return resolve(client.storage.achievements.find(x => x.name == type).data.find(x => x.name == name));
        });
    }

    checkAchievementCompleted(client, user, name) {
        return new Promise((resolve, reject) => {
            client.models.achievements.findOne({
                "user_id": user.id
            }, (err, db) => {
                if (err) return reject(err);
                if (db.achievements.find(x => x.name == name).completed == true) return resolve(true);
                else return resolve(false);
            });
        });
    }
}

const {
    Multiple
} = require(`../modules`);
class ah extends helpers {
    constructor(client, user, type, data = {}) {
        super();
        this.client = client;
        this.user = user;
        this.type = type;
        this.data = data;
    }

    // input information into DB based on what information is provided
    // with the information, run checks on all achievements to see if it matches
    // process achievement if match
    // update achievements database with completed true and timestamp
    //
    // TYPES:
    //
    // updateXP
    //  data provides =>
    //      positive: Boolean,
    //      xp: Amount
    //  handles =>
    //      getXP
    //      reachLeaderboard
    //
    // updateCoins
    //  data provides =>
    //      positive: Boolean,
    //      coins: Amount
    //  handles =>
    //      getCoins
    //      haveCoins
    //      reachLeaderboard
    //
    // updateLevel
    //  data provides =>
    //      level: Number (increase)
    //  handles =>
    //      getLevel
    //
    // updateMC
    //  data provides =>
    //      count: (increase)
    //  handles =>
    //      getMessageCount
    //      reachLeaderboard
    //
    // claimCrate
    //  handles =>
    //      getCrates
    //
    // claimPouch
    //  handles =>
    //      getPouches
    //
    // claimBooster
    //  handles =>
    //      getBoosters
    //      activeBoosts
    //
    // expireBooster
    //  handles =>
    //      activeBoosts
    //
    // applicationProcessed
    //  handles =>
    //      firstApplication

    handle() {
        let obj = {
            'updateXP': this.XPLoadBalancer()
        }
        return obj[`${this.type}`];
    }

    async XPLoadBalancer() {
        if (!this.data.positive) return new this.client.methods.log(this.client).error(`Error on XPLoadBalancer achievementHandler => Cannot find "positive" under data{}`);
        if (!this.data.xp) return new this.client.methods.log(this.client).error(`Error on XPLoadBalancer achievementHandler => Cannot find "xp" under data{}`);
        if (this.data.positive == true) {
            console.log('1');
            await new xp(this.client, this.user, this.type, this.data).handleGetXP().catch(err => new this.client.methods.log(this.client).error(err));
        }
        //await new leaderboard(this.client, this.user, this.type, this.data).handleReachLeaderboard().catch(err => new this.client.methods.log(this.client).error(err));
    }

    /* ABBREVIATED AS HNA */
    handleNewAchievement(type, name) {
        const data = this.getAchievementData(this.client, type, name);
        if (!data) return new this.client.methods.log(this.client).error(`Error on handleNewAchievement achievementHandler => Assumed wrong information provided, data NOT found`);
        this.HNAUpdateDB(name);
        this.HNAHandleRewards(data);
        this.HNANotify(data);

    }

    HNAUpdateDB(name) {
        this.client.models.achievements.findOne({
            "user_id": this.user.id
        }, (err, db) => {
            if (err) return new this.client.methods.log(this.client).error(err);
            db.achievements.find(x => x.name == name).completed = true;
            db.achievements.find(x => x.name == name).timestamp = new Date();
            db.save((err) => {
                if (err) return new this.client.methods.log(this.client).error(err);
            });
        });
    }

    HNAHandleRewards(data) {
        this.client.mdoels.userProfiles.findOne({
            "user_id": this.user.id
        }, (err, db) => {
            if (err) return new this.client.methods.log(this.client).error(err);
            if (data.reward.xp !== null) {
                db.user_xp += data.reward.xp;
            }
            if (data.reward.coins !== null) {
                db.user_coins += data.reward.coins;
            }
            db.save((err) => {
                if (err) return new this.client.methods.log(this.client).error(err);
            });
        });
        if (data.reward.inventoryID !== null) {
            this.client.models.userInventories.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) return new this.client.methods.log(this.client).error(err);
                for (const id of data.reward.inventoryID) {
                    if (db.inventory.find(x => x.id == id)) {
                        db.inventory.find(x => x.id == id).amount += 1;
                    } else {
                        db.inventory.push({
                            id: id,
                            amount: 1
                        });
                    }
                }
                db.save((err) => {
                    if (err) return new this.client.methods.log(this.client).error(err);
                });
            });
        }
    }

    HNANotify(data) {
        let embed = new this.client.modules.Discord.MessageEmbed()
            .setTitle(`:tada: **Achievement Unlocked** :tada:`)
            .setDescription(`** **\nUnlocked: \`[${data.name}](${data.description})\`\n** **${data.reward.message !== null ? `\nReward:\n${data.reward.message}\n** **` : ''}`)
            .setTimestamp()
        this.user.send(embed);
    }
}
module.exports = class a extends ah {
    constructor(client, user, type, data = {}) {
        super(client, user, type, data);
    }
};

class leaderboard extends ah {
    constructor(client, user, type, data = {}) {
        super(client, user, type, data);
        this.client = client;
        this.user = user;
        this.type = type;
        this.data = data;
    }

    rlXPLeaderboard() {
        return new Promise((resolve, reject) => {
            this.client.models.userProfiles.find({}).sort(`-user_xp`).exec((err, result) => {
                if (err) return reject(err);
                for (const c in result) {
                    if (result[c].user_id == this.user.id) {
                        resolve(c + 1);
                        break;
                    } else continue;
                }
            });
        });
    }

    rlCoinLeaderboard() {
        return new Promise((resolve, reject) => {
            this.client.models.userProfiles.find({}).sort(`-user_coins`).exec((err, result) => {
                if (err) return reject(err);
                for (const c in result) {
                    if (result[c].user_id == this.user.id) {
                        resolve(c + 1);
                        break;
                    } else continue;
                }
            })
        })
    }

    rlAvgXPLeaderboard() {
        return new Promise((resolve, reject) => {
            this.client.models.userProfiles.find({}).lean().exec(async (err, docs) => {
                if (err) return reject(err);
                let obj = {
                    users: []
                };
                for (const count in docs) {
                    obj.users.push({
                        user_id: docs[count].user_id,
                        avg_msg_xp: parseFloat((docs[count].user_xp / docs[count].message_count).toFixed(2))
                    });
                }
                obj.users = obj.users.sort((a, b) => b.avg_msg_xp - a.avg_msg_xp);
                for (const c in obj.users) {
                    if (obj.users[c].user_id == this.user.id) {
                        resolve(c + 1);
                        break;
                    } else continue;
                }
            });
        });
    }

    rlMessageCountLeaderboard() {
        return new Promise((resolve, reject) => {
            this.client.models.userProfiles.find({}).sort(`-message_count`).exec((err, result) => {
                if (err) return reject(err);
                for (const c in result) {
                    if (result[c].user_id == this.user.id) {
                        resolve(c + 1);
                        break;
                    } else continue;
                }
            });
        });
    }

    /* ABBREVIATED TO RL */
    handleReachLeaderboard() {
        return new Promise(async (resolve, reject) => {
            const xpIndex = await this.rlXPLeaderboard().catch(err => reject(err));
            const coinIndex = await this.rlCoinLeaderboard().catch(err => reject(err));
            const AvgXPIndex = await this.rlAvgXPLeaderboard().catch(err => reject(err));
            const MCIndex = await this.rlMessageCountLeaderboard().catch(err => reject(err));
            let array = [xpIndex, coinIndex, AvgXPIndex, MCIndex];
            array.sort((a, b) => b - a);
            const hoist = await this.dbReachLeaderboard(xpIndex, coinIndex, AvgXPIndex, MCIndex, array);
            this.checkReachLeaderboard(hoist);
        });
    }

    dbReachLeaderboard(xpIndex, coinIndex, AvgXPIndex, MCIndex, max_hoist) {
        return new Promise((resolve, reject) => {
            this.client.models.achievements.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) return reject(err);
                db.achievements.find(x => x.type == 'reachLeaderboard').data.find(x => x.type == 'XP').hoist = xpIndex;
                db.achievements.find(x => x.type == 'reachLeaderboard').data.find(x => x.type == 'COIN').hoist = coinIndex;
                db.achievements.find(x => x.type == 'reachLeaderboard').data.find(x => x.type == 'AVGXP').hoist = AvgXPIndex;
                db.achievements.find(x => x.type == 'reachLeaderboard').data.find(x => x.type == 'MC').hoist = MCIndex;
                db.achievements.find(x => x.type == 'reachLeaderboard').data.find(x => x.type == 'null').max_hoist = max_hoist;
                db.save((err) => {
                    if (err) return reject(err);
                    else return resolve(db.achievements.find(x => x.type == 'reachLeaderboard').data.find(x => x.type == 'null').max_hoist);
                });
            });
        });
    }

    async checkReachLeaderboard(hoist) {
        return new Promise(async (resolve, reject) => {
            const dataArray = this.getAchievementObject(this.client, 'reachLeaderboard').data;
            if (!dataArray) return reject(`Object reachLeaderboard cannot be found in achievements storage!`);
            for (const count in dataArray) {
                if (hoist <= dataArray[count].hoist) {
                    this.client.models.achievements.findOne({
                        "user_id": this.user.id
                    }, (err, db) => {
                        if (err) return reject(err);
                        if (db.achievements.find(x => x.name == dataArray[count].name).completed == true) continue;
                        this.handleNewAchievement('reachLeaderboard', db.achievements.find(x => x.name == dataArray[count].name));
                    });
                } else continue;
            }
            return resolve();
        });
    }
}

class xp extends ah {
    constructor(client, user, type, data = {}) {
        super(client, user, type, data);
        this.client = client;
        this.user = user;
        this.type = type;
        this.data = data;
    }

    handleGetXP() {
        return new Promise(async (resolve, reject) => {
            const xp = await this.dbGetXP().catch(err => reject(err));
            await this.checkGetXP(xp).catch(err => reject(err));
            return resolve();
        });
    }

    dbGetXP() {
        return new Promise((resolve, reject) => {
            this.client.models.achievementsLogs.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) reject(err);
                db.achievements.find(x => x.type == 'getXP').xp += this.data.xp;
                db.markModified("achievements");
                db.save((err) => {
                    if (err) return reject(err);
                    else return resolve(db.achievements.find(x => x.type == 'getXP').xp);
                });
            });
        });
    }

    async checkGetXP(xp) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == 'getXP').data;
            if (!obj) return reject(`Object getXP cannot be found in achievements storage!`);
            for (const count in obj) {
                if (xp >= obj[count].amount) {
                    let completed = await this.checkAchievementCompleted(this.client, this.user, obj[count].name);
                    if (completed == true) continue;
                    this.handleNewAchievement('getXP', obj[count].name);
                } else continue;
            }
            return resolve();
        });
    }

}
