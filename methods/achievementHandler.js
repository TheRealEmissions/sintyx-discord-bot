// @ts-check
class helpers {
    constructor() {};

    getAchievementObject(client, type) {
        return new Promise((resolve, reject) => {
            return resolve(client.storage.achievements.find(x => x.type == type));
        });
    }

    getAchievementData(client, type, name) {
        return new Promise((resolve, reject) => {
            return resolve(client.storage.achievements.find(x => x.type == type).data.find(x => x.name == name));
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

class ah extends helpers {
    constructor(client, user, type, data) {
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
    //  data provides => null
    //  handles =>
    //      getLevel
    //
    // updateMC
    //  data provides => null
    //  handles =>
    //      getMessageCount
    //      reachLeaderboard
    //
    // claimCrate
    //  data provides =>
    //      inventory_id: Number
    //  handles =>
    //      getCrates
    //
    // claimPouch
    //  data provides =>
    //      inventory_id: Number
    //  handles =>
    //      getPouches
    //
    // claimBooster
    //  data provides =>
    //      inventory_id: Number
    //  handles =>
    //      getBoosters
    //      activeBoosts
    //
    // expireBooster
    //  data provides =>
    //      inventory_id: Number
    //  handles =>
    //      activeBoosts
    //
    // applicationProcessed
    //  data provides =>
    //      reference_id: String
    //  handles =>
    //      firstApplication

    handle() {
        switch (this.type) {
            case 'updateXP':
                this.XPLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'updateCoins':
                this.CoinLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'updateLevel':
                this.LevelLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'updateMC':
                this.MCLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'claimCrate':
                this.CrateLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'claimPouch':
                this.PouchLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'claimBooster':
                this.BoosterLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'expireBooster':
                this.BoosterLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'applicationProcessed':
                this.applicationLoadBalancer().catch(err => new this.client.methods.log(this.client).error(err));
                break;
            default:
                new this.client.methods.log(this.client).error(`While handling achievementHandler: could not find this.type correct string`);
                break;
        }
    }

    //
    //      LOAD BALANCERS
    //

    async applicationLoadBalancer() {
        if (typeof this.data.reference_id == "undefined") return new this.client.methods.log(this.client).error(`Error on ApplicationLoadBalancer achievementHandler => Cannot find "inventory_id" under data{}`);
        await new application(this.client, this.user, this.type, this.data).handleFirstApplication().catch(err => new this.client.methods.log(this.client).error(err));
    }

    async BoosterLoadBalancer() {
        if (typeof this.data.inventory_id == "undefined") return new this.client.methods.log(this.client).error(`Error on BoosterLoadBalancer achievementHandler => Cannot find "inventory_id" under data{}`);
        if (this.type == 'claimBooster') {
            await new boost(this.client, this.user, this.type, this.data).handleGetBoosters().catch(err => new this.client.methods.log(this.client).error(err));
            await new boost(this.client, this.user, this.type, this.data).handleActiveBoosts(true).catch(err => new this.client.methods.log(this.client).error(err));
        }
        if (this.type == 'expireBooster') {
            await new boost(this.client, this.user, this.type, this.data).handleActiveBoosts(false).catch(err => new this.client.methods.log(this.client).error(err));
        }
    }

    async PouchLoadBalancer() {
        if (typeof this.data.inventory_id == "undefined") return new this.client.methods.log(this.client).error(`Error on PouchLoadBalancer achievementHandler => Cannot find "inventory_id" under data{}`);
        await new pouch(this.client, this.user, this.type, this.data).handleGetPouches().catch(err => new this.client.methods.log(this.client).error(err));
    }

    async CrateLoadBalancer() {
        if (typeof this.data.inventory_id == "undefined") return new this.client.methods.log(this.client).error(`Error on CrateLoadBalancer achievementHandler => Cannot find "inventory_id" under data{}`);
        await new crate(this.client, this.user, this.type, this.data).handleGetCrates().catch(err => new this.client.methods.log(this.client).error(err));
    }

    async MCLoadBalancer() {
        await new mc(this.client, this.user, this.type).handleGetMessageCount().catch(err => new this.client.methods.log(this.client).error(err));
        await new leaderboard(this.client, this.user, this.type).handleReachLeaderboard().catch(err => new this.client.methods.log(this.client).error(err));
    }

    async LevelLoadBalancer() {
        await new level(this.client, this.user, this.type).handleGetLevel().catch(err => new this.client.methods.log(this.client).error(err));
    }

    async CoinLoadBalancer() {
        if (typeof this.data.positive == "undefined") return new this.client.methods.log(this.client).error(`Error on CoinLoadBalancer achievementHandler => Cannot find "positive" under data{}`);
        if (typeof this.data.coins == "undefined") return new this.client.methods.log(this.client).error(`Error on CoinLoadBalancer achievementHandler => Cannot find "coins" under data{}`);
        if (this.data.positive == true) {
            await new coins(this.client, this.user, this.type, this.data).handleGetCoins().catch(err => new this.client.methods.log(this.client).error(err));
        }
        await new coins(this.client, this.user, this.type, this.data).handleHaveCoins().catch(err => new this.client.methods.log(this.client).error(err));
        await new leaderboard(this.client, this.user, this.type, this.data).handleReachLeaderboard().catch(err => new this.client.methods.log(this.client).error(err));
    }

    async XPLoadBalancer() {
        if (typeof this.data.positive == "undefined") return new this.client.methods.log(this.client).error(`Error on XPLoadBalancer achievementHandler => Cannot find "positive" under data{}`);
        if (typeof this.data.xp == "undefined") return new this.client.methods.log(this.client).error(`Error on XPLoadBalancer achievementHandler => Cannot find "xp" under data{}`);
        if (this.data.positive == true) {
            await new xp(this.client, this.user, this.type, this.data).handleGetXP().catch(err => new this.client.methods.log(this.client).error(err));
        }
        await new leaderboard(this.client, this.user, this.type, this.data).handleReachLeaderboard().catch(err => new this.client.methods.log(this.client).error(err));
    }

    //
    //      ACHIEVEMENT HANDLERS
    //

    /* ABBREVIATED AS HNA */
    async handleNewAchievement(type, name) {
        const data = await this.getAchievementData(this.client, type, name);
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
            db.markModified("achievements");
            db.save((err) => {
                if (err) return new this.client.methods.log(this.client).error(err);
            });
        });
    }

    HNAHandleRewards(data) {
        this.client.models.userProfiles.findOne({
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
                else {
                    if (data.reward.xp !== null) {
                        new this.client.methods.achievementHandler(this.client, this.user, 'updateXP', {
                            positive: true,
                            xp: data.reward.xp
                        });
                    }
                    if (data.reward.coins !== null) {
                        new this.client.methods.achievementHandler(this.client, this.user, 'updateCoins', {
                            positive: true,
                            coins: data.reward.coins
                        });
                    }
                }
            });
        });
        if (data.reward.inventoryID !== null) {
            this.client.models.userInventories.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) return new this.client.methods.log(this.client).error(err);
                for (const obj of data.reward.inventoryID) {
                    if (db.inventory.find(x => x.id == obj.id)) {
                        db.inventory.find(x => x.id == obj.id).amount += obj.amount;
                    } else {
                        db.inventory.push({
                            id: obj.id,
                            amount: obj.amount
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
            .setColor(this.user.guild.member(this.client).displayHexColor)
            .setDescription(`** **\nUnlocked: [${data.name}](https://sintyx.com/ "${data.description}")\n** **${data.reward.message !== null ? `\nReward:\n${data.reward.message}\n** **` : ''}`)
            .setTimestamp()
        this.user.send(embed);
    }
}
module.exports = class a extends ah {
    constructor(client, user, type, data = {}) {
        super(client, user, type, data);
    }
};

class application extends ah {
    constructor(client, user, type, data) {
        super(client, user, type, data);
        this.client = client;
        this.user = user;
        this.type = type;
        this.data = data;
    }

    handleFirstApplication() {
        return new Promise(async (resolve, reject) => {
            await this.dbFirstApplication().catch(err => reject(err));
            await this.checkFirstApplication().catch(err => reject(err));
            return resolve();
        });
    }

    dbFirstApplication() {
        return new Promise((resolve, reject) => {
            this.client.methods.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                db.achievements.find(x => x.type == "firstApplication").id = this.data.reference_id;
                await db.markModified("achievements");
                db.save((err) => {
                    if (err) return reject(err);
                    else return resolve();
                });
            });
        });
    }

    checkFirstApplication() {
        return new Promise((resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == "firstApplication").data;
            if (!obj) return reject(`Object firstApplication cannot be found in achievements storage!`);
            this.client.models.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                let appid = db.achievements.find(x => x.type == "firstApplication").id;
                if (appid == null) return reject(`checkFirstApplication called but reference ID is null!`);
                else {
                    let completed = await this.checkAchievementCompleted(this.client, this.user, obj[0].name);
                    if (completed == true) return resolve();
                    this.handleNewAchievement('firstApplication', obj[0].name);
                    return resolve();
                }
            });
        });
    }
}

class boost extends ah {
    constructor(client, user, type, data) {
        super(client, user, type, data);
        this.client = client;
        this.user = user;
        this.type = type;
        this.data = data;
    }

    resolveIDToBoosterType(id) {
        return new Promise((resolve, reject) => {
            const invitem = this.client.storage.inventoryItems.find(x => x.id == id);
            if (!invitem) return reject(`Inventory item of ID ${id} could not be found in achievementHandler resolveIDToBoosterType`);
            const type = invitem.reward[0].type;
            if (!type) return reject(`Type of inventory ID ${id} could not be found in achievementHandler resolveIDToBoosterType`);
            return resolve(type);
        });
    }

    handleGetBoosters() {
        return new Promise(async (resolve, reject) => {
            const boosters = await this.dbGetBoosters().catch(err => reject(err));
            await this.checkGetBoosters(boosters).catch(err => reject(err));
            return resolve();
        });
    }

    dbGetBoosters() {
        return new Promise((resolve, reject) => {
            this.client.methods.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                const type = await this.resolveIDToBoosterType(this.data.inventory_id);
                try {
                    db.achievements.find(x => x.type == "getBoosters").null_amount += 1;
                    if (type == 'XP') {
                        db.achievements.find(x => x.type == "getBoosters").xp_amount += 1;
                    }
                    if (type == 'COIN') {
                        db.achievements.find(x => x.type == "getBoosters").coin_amount += 1;
                    }
                    await db.markModified("achievements");
                    await db.save((err) => {
                        if (err) return reject(err);
                        else return resolve([{
                            type: 'null',
                            amount: db.achievements.find(x => x.type == "getBoosters").null_amount
                        }, {
                            type: 'XP',
                            amount: db.achievements.find(x => x.type == "getBoosters").xp_amount
                        }, {
                            type: 'COIN',
                            amount: db.achievements.find(x => x.type == "getBoosters").coin_amount
                        }]);
                    });
                } catch (err) {
                    return reject(err);
                }
            });
        });
    }

    checkGetBoosters(dbobj) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == "getBoosters").data;
            if (!obj) return reject(`Object getBoosters cannot be found in achievements storage!`);
            for (const ach of obj) {
                for (const am of dbobj) {
                    if (ach.type !== am.type) continue;
                    if (am.amount >= ach.amount) {
                        let completed = await this.checkAchievementCompleted(this.client, this.user, ach.name);
                        if (completed == true) continue;
                        this.handleNewAchievement('getBoosters', ach.name);
                    } else continue;
                }
            }
            return resolve();
        });
    }

    handleActiveBoosts(boolean) {
        return new Promise(async (resolve, reject) => {
            const boosters = await this.dbActiveBoosts(boolean).catch(err => reject(err));
            await this.checkActiveBoosts(boosters).catch(err => reject(err));
            return resolve();
        });
    }

    dbActiveBoosts(boolean) {
        return new Promise((resolve, reject) => {
            this.client.methods.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                const type = await this.resolveIDToBoosterType(this.data.inventory_id);
                try {
                    if (boolean == true) {
                        db.achievements.find(x => x.type == "activeBoosts").null_amount += 1;
                    } else if (boolean == false) {
                        db.achievements.find(x => x.type == "activeBoosts").null_amount -= 1;
                    }
                    if (type == 'XP') {
                        if (boolean == true) {
                            db.achievements.find(x => x.type == "activeBoosts").xp_amount += 1;
                        } else if (boolean == false) {
                            db.achievements.find(x => x.type == "activeBoosts").xp_amount -= 1;
                        }
                    }
                    if (type == 'COIN') {
                        if (boolean == true) {
                            db.achievements.find(x => x.type == "activeBoosts").coin_amount += 1;
                        } else if (boolean == false) {
                            db.achievements.find(x => x.type == "activeBoosts").coin_amount -= 1;
                        }
                    }
                    await db.markModified("achievements");
                    await db.save((err) => {
                        if (err) return reject(err);
                        else return resolve([{
                            type: 'null',
                            amount: db.achievements.find(x => x.type == "activeBoosts").null_amount
                        }, {
                            type: 'XP',
                            amount: db.achievements.find(x => x.type == "activeBoosts").xp_amount
                        }, {
                            type: 'COIN',
                            amount: db.achievements.find(x => x.type == "activeBoosts").coin_amount
                        }]);
                    });
                } catch (err) {
                    return reject(err);
                }
            });
        });
    }

    checkActiveBoosts(dbobj) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == "activeBoosts").data;
            if (!obj) return reject(`Object activeBoosts cannot be found in achievements storage!`);
            for (const ach of obj) {
                for (const am of dbobj) {
                    if (ach.type !== am.type) continue;
                    if (am.amount >= ach.amount) {
                        let completed = await this.checkAchievementCompleted(this.client, this.user, ach.name);
                        if (completed == true) continue;
                        this.handleNewAchievement('activeBoosts', ach.name);
                    } else continue;
                }
            }
            return resolve();
        });
    }
}

class pouch extends ah {
    constructor(client, user, type, data) {
        super(client, user, type, data);
        this.client = client;
        this.user = user;
        this.type = type;
        this.data = data;
    }

    handleGetPouches() {
        return new Promise(async (resolve, reject) => {
            const pouches = await this.dbGetPouches().catch(err => reject(err));
            await this.checkGetPouches(pouches).catch(err => reject(err));
            return resolve();
        });
    }

    resolveIDToPouchType(id) {
        return new Promise((resolve, reject) => {
            const invitem = this.client.storage.inventoryItems.find(x => x.id == id);
            if (!invitem) return reject(`Inventory item of ID ${id} could not be found in achievementHandler resolveIDToPouchType`);
            const type = invitem.reward[0].type;
            if (!type) return reject(`Type of inventory ID ${id} could not be found in achievementHandler resolveIDToPouchType`);
            return resolve(type);
        });
    }

    dbGetPouches() {
        return new Promise((resolve, reject) => {
            this.client.methods.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                const type = await this.resolveIDToPouchType(this.data.inventory_id);
                try {
                    db.achievements.find(x => x.type == "getPouches").null_amount += 1;
                    if (type == 'XP') {
                        db.achievements.find(x => x.type == "getPouches").xp_amount += 1;
                    }
                    if (type == 'COIN') {
                        db.achievements.find(x => x.type == "getPouches").coin_amount += 1;
                    }
                    await db.markModified("achievements");
                    await db.save((err) => {
                        if (err) return reject(err);
                        else return resolve([{
                            type: 'null',
                            amount: db.achievements.find(x => x.type == "getPouches").null_amount
                        }, {
                            type: 'XP',
                            amount: db.achievements.find(x => x.type == "getPouches").xp_amount
                        }, {
                            type: 'COIN',
                            amount: db.achievements.find(x => x.type == "getPouches").coin_amount
                        }]);
                    });
                } catch (err) {
                    return reject(err);
                }
            });
        });
    }

    checkGetPouches(dbobj) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == 'getPouches').data;
            if (!obj) return reject(`Object getPouches cannot be found in achievements storage!`);
            for (const ach of obj) {
                for (const am of dbobj) {
                    if (ach.type !== am.type) continue;
                    if (am.amount >= ach.amount) {
                        let completed = await this.checkAchievementCompleted(this.client, this.user, ach.name);
                        if (completed == true) continue;
                        this.handleNewAchievement('getPouches', ach.name);
                    } else continue;
                }
            }
            return resolve();
        });
    }
}

class crate extends ah {
    constructor(client, user, type, data) {
        super(client, user, type, data);
        this.client = client;
        this.user = user;
        this.type = type;
        this.data = data;
    }

    handleGetCrates() {
        return new Promise(async (resolve, reject) => {
            const crates = await this.dbGetCrates().catch(err => reject(err));
            await this.checkGetCrates(crates).catch(err => reject(err));
            return resolve();
        });
    }

    resolveIDToCrateType(id) {
        return new Promise((resolve, reject) => {
            const invitem = this.client.storage.inventoryItems.find(x => x.id == id);
            if (!invitem) return reject(`Inventory item of ID ${id} could not be found in achievementHandler resolveIDToCrateType`);
            const type = invitem.reward[0].type;
            if (!type) return reject(`Type of inventory ID ${id} could not be found in achievementHandler resolveIDToCrateType`);
            return resolve(type);
        });
    }

    dbGetCrates() {
        return new Promise((resolve, reject) => {
            this.client.models.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                const type = await this.resolveIDToCrateType(this.data.inventory_id);
                try {
                    db.achievements.find(x => x.type == "getCrates").null_amount += 1;
                    if (type == 'XP') {
                        db.achievements.find(x => x.type == "getCrates").xp_amount += 1;
                    }
                    if (type == 'COIN') {
                        db.achievements.find(x => x.type == "getCrates").coin_amount += 1;
                    }
                    await db.markModified("achievements");
                    await db.save((err) => {
                        if (err) return reject(err);
                        else return resolve([{
                                type: 'null',
                                amount: db.achievements.find(x => x.type == "getCrates").null_amount,
                            },
                            {
                                type: 'XP',
                                amount: db.achievements.find(x => x.type == "getCrates").xp_amount,
                            },
                            {
                                type: 'COIN',
                                amount: db.achievements.find(x => x.type == "getCrates").coin_amount
                            }
                        ]);
                    });
                } catch (err) {
                    return reject(err);
                }
            });
        });
    }

    checkGetCrates(dbobj) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == 'getCrates').data;
            if (!obj) return reject(`Object getCrates cannot be found in achievements storage!`);
            for (const ach of obj) {
                for (const am of dbobj) {
                    if (ach.type !== am.type) continue;
                    if (am.amount >= ach.amount) {
                        let completed = await this.checkAchievementCompleted(this.client, this.user, ach.name);
                        if (completed == true) continue;
                        this.handleNewAchievement('getCrates', ach.name);
                    } else continue;
                }
            }
            return resolve();
        });
    }
}

class mc extends ah {
    constructor(client, user, type) {
        super(client, user, type);
        this.client = client;
        this.user = user;
        this.type = type;
    }

    handleGetMessageCount() {
        return new Promise(async (resolve, reject) => {
            const count = await this.dbGetMessageCount().catch(err => reject(err));
            await this.checkGetMessageCount(count).catch(err => reject(err));
            return resolve();
        });
    }

    checkGetMessageCount(count) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == 'getMessageCount').data;
            if (!obj) return reject(`Object getMessageCount cannot be found in achievements storage!`);
            for (const n in obj) {
                if (count >= obj[n].amount) {
                    let completed = await this.checkAchievementCompleted(this.client, this.user, obj[n].name);
                    if (completed == true) continue;
                    this.handleNewAchievement('getMessageCount', obj[n].name);
                } else continue;
            }
            return resolve();
        });
    }

    getUserMessageCount() {
        return new Promise((resolve, reject) => {
            this.client.models.userProfiles.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) return reject(err);
                return resolve(db.message_count);
            });
        });
    }

    dbGetMessageCount() {
        return new Promise((resolve, reject) => {
            this.client.models.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                const count = await this.getUserMessageCount().catch(err => reject(err));
                console.log(count > db.achievements.find(x => x.type == 'getMessageCount').amount);
                if (parseInt(count) > parseInt(db.achievements.find(x => x.type == 'getMessageCount').amount)) {
                    db.achievements.find(x => x.type == 'getMessageCount').amount = count;
                    db.markModified("achievements");
                    db.save((err) => {
                        if (err) return reject(err);
                        else return resolve(count);
                    });
                }
            });
        });
    }
}

class level extends ah {
    constructor(client, user, type) {
        super(client, user, type);
        this.client = client;
        this.user = user;
        this.type = type;
    }

    getUserLevel() {
        return new Promise((resolve, reject) => {
            this.client.models.userProfiles.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) return reject(err);
                return resolve(db.user_level);
            });
        });
    }

    handleGetLevel() {
        return new Promise(async (resolve, reject) => {
            const level = await this.dbGetLevel().catch(err => reject(err));
            await this.checkGetLevel(level).catch(err => reject(err));
            return resolve();
        });
    }

    dbGetLevel() {
        return new Promise((resolve, reject) => {
            this.client.models.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                const level = await this.getUserLevel().catch(err => new this.client.methods.log(this.client).error(err));
                if (level > db.achievements.find(x => x.type == 'getLevel').level) {
                    db.achievements.find(x => x.type == 'getLevel').level = level;
                    db.markModified("achievements");
                    db.save((err) => {
                        if (err) return reject(err);
                        else return resolve(level);
                    });
                } else return resolve(db.achievements.find(x => x.type == 'getLevel').level);
            });
        });
    }

    checkGetLevel(level) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == 'getLevel').data;
            if (!obj) return reject(`Object getLevel cannot be found in achievements storage!`);
            for (const count in obj) {
                if (level >= obj[count].level) {
                    let completed = await this.checkAchievementCompleted(this.client, this.user, obj[count].name);
                    if (completed == true) continue;
                    this.handleNewAchievement('getLevel', obj[count].name);
                } else continue;
            }
            return resolve();
        });
    }
}

class coins extends ah {
    constructor(client, user, type, data) {
        super(client, user, type, data);
        this.client = client;
        this.user = user;
        this.type = type;
        this.data = data;
    }

    getUserCoins() {
        return new Promise(async (resolve, reject) => {
            this.client.models.userProfiles.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) return reject(err);
                return resolve(db.user_coins);
            });
        });
    }

    handleHaveCoins() {
        return new Promise(async (resolve, reject) => {
            const coins = await this.dbHaveCoins().catch(err => reject(err));
            await this.checkHaveCoins(coins).catch(err => reject(err));
            return resolve();
        });
    }

    dbHaveCoins() {
        return new Promise((resolve, reject) => {
            this.client.models.achievementsLogs.findOne({
                "user_id": this.user.id
            }, async (err, db) => {
                if (err) return reject(err);
                const coins = await this.getUserCoins();
                db.achievements.find(x => x.type == 'haveCoins').max = coins;
                db.markModified("achievements");
                db.save((err) => {
                    if (err) return reject(err);
                    else return resolve(coins);
                });
            });
        });
    }

    checkHaveCoins(coins) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == 'haveCoins').data;
            if (!obj) return reject(`Object haveCoins cannot be found in achievements storage!`);
            for (const count in obj) {
                if (coins >= obj[count].amount) {
                    let completed = await this.checkAchievementCompleted(this.client, this.user, obj[count].name);
                    if (completed == true) continue;
                    this.handleNewAchievement('haveCoins', obj[count].name);
                } else continue;
            }
            return resolve();
        });
    }

    handleGetCoins() {
        return new Promise(async (resolve, reject) => {
            const coins = await this.dbGetCoins().catch(err => reject(err));
            await this.checkGetCoins(coins).catch(err => reject(err));
            return resolve();
        });
    }

    dbGetCoins() {
        return new Promise(async (resolve, reject) => {
            this.client.models.achievementsLogs.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) return reject(err);
                db.achievements.find(x => x.type == 'getCoins').amount += this.data.coins;
                db.markModified("achievements");
                db.save((err) => {
                    if (err) return reject(err);
                    else return resolve(db.achievements.find(x => x.type == 'getCoins').amount);
                });
            })
        });
    }

    async checkGetCoins(coins) {
        return new Promise(async (resolve, reject) => {
            let obj = this.client.storage.achievements.find(x => x.type == 'getXP').data;
            if (!obj) return reject(`Object getCoins cannot be found in achievements storage!`);
            for (const count in obj) {
                if (coins >= obj[count].amount) {
                    let completed = await this.checkAchievementCompleted(this.client, this.user, obj[count].name);
                    if (completed == true) continue;
                    this.handleNewAchievement('getCoins', obj[count].name);
                } else continue;
            }
            return resolve();
        });
    }
}

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
                        resolve(parseInt(c) + 1);
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
                        resolve(parseInt(c) + 1);
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
                        resolve(parseInt(c) + 1);
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
                        resolve(parseInt(c) + 1);
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
            const hoist = await this.dbReachLeaderboard(xpIndex, coinIndex, AvgXPIndex, MCIndex, array[0]);
            this.checkReachLeaderboard(hoist);
            return resolve();
        });
    }

    dbReachLeaderboard(xpIndex, coinIndex, AvgXPIndex, MCIndex, max_hoist) {
        return new Promise((resolve, reject) => {
            this.client.models.achievementsLogs.findOne({
                "user_id": this.user.id
            }, (err, db) => {
                if (err) return reject(err);
                db.achievements.find(x => x.type == 'reachLeaderboard').xp_hoist = xpIndex;
                db.achievements.find(x => x.type == 'reachLeaderboard').coin_hoist = coinIndex;
                db.achievements.find(x => x.type == 'reachLeaderboard').avgxp_hoist = AvgXPIndex;
                db.achievements.find(x => x.type == 'reachLeaderboard').mc_hoist = MCIndex;
                db.achievements.find(x => x.type == 'reachLeaderboard').best_hoist = max_hoist;
                db.markModified("achievements");
                db.save((err) => {
                    if (err) return reject(err);
                    else return resolve(db.achievements.find(x => x.type == 'reachLeaderboard').best_hoist);
                });
            });
        });
    }

    async checkReachLeaderboard(hoist) {
        return new Promise(async (resolve, reject) => {
            let dataArray = await this.getAchievementObject(this.client, 'reachLeaderboard');
            if (!dataArray) return reject(`Object reachLeaderboard cannot be found in achievements storage!`);
            dataArray = dataArray.data;
            for (const count in dataArray) {
                if (hoist <= dataArray[count].hoist) {
                    if (await this.checkAchievementCompleted(this.client, this.user, dataArray[count].name) == true) continue;
                    this.handleNewAchievement('reachLeaderboard', dataArray[count].name);
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
                if (err) return reject(err);
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
