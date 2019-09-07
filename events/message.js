let suggestionCooldown = new Set();
let xpCooldown = new Set();

class checkdb {
    constructor() {}

    async dbInit(client, message) {
        return new Promise(async (resolve, reject) => {
            await Promise.all([
                this.userProfiles(client, message).catch(err => new client.methods.log(client).error(err)),
                this.userSettings(client, message).catch(err => new client.methods.log(client).error(err)),
                this.userInventories(client, message).catch(err => new client.methods.log(client).error(err)),
                this.guildSettings(client, message).catch(err => new client.methods.log(client).error(err)),
                this.achievements(client, message).catch(err => new client.methods.log(client).error(err)),
                this.achievementsLogs(client, message).catch(err => new client.methods.log(client).error(err)),
            ])
            return resolve();
        });
    }

    achievementReturnObj(type) {
        let obj = {
            'getXP': {
                type: 'getXP',
                xp: 0
            },
            'getLevel': {
                type: 'getLevel',
                level: 1
            },
            'getCrates': {
                type: 'getCrates',
                null_amount: 0,
                xp_amount: 0,
                coin_amount: 0
            },
            'getPouches': {
                type: 'getPouches',
                null_amount: 0,
                xp_amount: 0,
                coin_amount: 0
            },
            'getBoosters': {
                type: 'getBoosters',
                null_amount: 0,
                xp_amount: 0,
                coin_amount: 0
            },
            'getCoins': {
                type: 'getCoins',
                amount: 0
            },
            'haveCoins': {
                type: 'haveCoins',
                max: 0
            },
            'activeBoosts': {
                type: 'activeBoosts',
                null_amount: 0,
                xp_amount: 0,
                coin_amount: 0
            },
            'getMessageCount': {
                type: 'getMessageCount',
                amount: 0
            },
            'reachLeaderboard': {
                type: 'reachLeaderboard',
                xp_hoist: 0,
                coin_hoist: 0,
                avgxp_hoist: 0,
                best_hoist: 0
            },
            'firstApplication': {
                type: 'firstApplication',
                id: null
            }
        }
        return obj[`${type}`];
    }

    achievementsLogs(client, message) {
        return new Promise((resolve, reject) => {
            client.models.achievementsLogs.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return reject(err);
                if (!db) {
                    let newdb = new client.models.achievementsLogs({
                        user_id: message.author.id
                    });
                    newdb.save((err) => {
                        if (err) return reject(err);
                        else {
                            client.models.achievementsLogs.findOne({
                                "user_id": message.author.id
                            }, (err, db) => {
                                if (err) return reject(err);
                                for (const achievementObj of client.storage.achievements) {
                                    db.achievements.push(this.achievementReturnObj(achievementObj.type));
                                }
                                db.save((err) => {
                                    if (err) return reject(err);
                                    else return resolve();
                                });
                            });
                        }
                    });
                } else {
                    for (const achievement of client.storage.achievements) {
                        if (!db.achievements.find(x => x.type == achievement.type)) {
                            db.achievements.push(this.achievementReturnObj(achievement.type));
                        }
                    }
                    db.save((err) => {
                        if (err) return reject(err);
                        else return resolve();
                    });
                }
            });
        });
    }

    achievements(client, message) {
        return new Promise((resolve, reject) => {
            client.models.achievements.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return reject(err);
                if (!db) {
                    let newdb = new client.models.achievements({
                        user_id: message.author.id
                    });
                    newdb.save((err) => {
                        if (err) return reject(err);
                        else {
                            client.models.achievements.findOne({
                                "user_id": message.author.id
                            }, (err, db) => {
                                if (err) return reject(err);
                                for (const achievementObj of client.storage.achievements) {
                                    for (const achievement of achievementObj.data) {
                                        db.achievements.push({
                                            name: achievement.name,
                                            completed: false,
                                            timestamp: null
                                        });
                                    }
                                }
                                db.save((err) => {
                                    if (err) return reject(err);
                                    else return resolve();
                                });
                            });
                        }
                    });
                } else {
                    client.models.achievements.findOne({
                        "user_id": message.author.id
                    }, (err, db) => {
                        if (err) return reject(err);
                        for (const achievementObj of client.storage.achievements) {
                            for (const achievement of achievementObj.data) {
                                if (!db.achievements.find(x => x.name == achievement.name)) {
                                    db.achievements.push({
                                        name: achievement.name,
                                        completed: false,
                                        timestamp: null
                                    });
                                }
                            }
                        }
                        db.save((err) => {
                            if (err) return reject(err);
                            else return resolve();
                        });
                    })
                }
            });
        });
    }

    userProfiles(client, message) {
        return new Promise((resolve, reject) => {
            client.models.userProfiles.findOne({
                    "user_id": message.author.id
                },
                (err, db) => {
                    if (err) return reject(err);
                    if (!db) {
                        let newdb = new client.models.userProfiles({
                            user_id: message.author.id,
                            user_xp: 0,
                            user_level: 1,
                            user_coins: 0,
                            user_slogan: ':x: No slogan currently set - set your slogan with `-setslogan <slogan>`',
                            message_count: 0
                        });
                        newdb.save(err => {
                            if (err) return reject(err);
                            else return resolve();
                        });
                    } else return resolve();
                }
            );
        });
    }

    userSettings(client, message) {
        return new Promise((resolve, reject) => {
            client.models.userSettings.findOne({
                    "user_id": message.author.id
                },
                (err, db) => {
                    if (err) return reject(err);
                    if (!db) {
                        let newdb = new client.models.userSettings({
                            user_id: message.author.id,
                            options: []
                        });
                        newdb.save(err => {
                            if (err) return reject(err);
                            else {
                                client.models.userSettings.findOne({
                                    "user_id": message.author.id
                                }, (err, db) => {
                                    if (err) return reject(err);
                                    let options = ["coin_ping", "xp_ping", "ticket_mentioning"];
                                    for (const option of options) {
                                        if (!db.options.find(x => x.name == option)) {
                                            db.options.push({
                                                name: option,
                                                boolean: false
                                            });
                                        }
                                    }
                                    db.save((err) => {
                                        if (err) return reject(err);
                                        else return resolve();
                                    });
                                });
                            }
                        });
                    } else {
                        let options = ["coin_ping", "xp_ping", "ticket_mentioning"];
                        for (const option of options) {
                            if (!db.options.find(x => x.name == option)) {
                                db.options.push({
                                    name: option,
                                    boolean: false
                                });
                            }
                        }
                        db.save(err => {
                            if (err) return reject(err);
                            else return resolve();
                        });
                    }
                }
            );
        });
    }

    userInventories(client, message) {
        return new Promise((resolve, reject) => {
            client.models.userInventories.findOne({
                    "user_id": message.author.id
                },
                (err, db) => {
                    if (err) return reject(err);
                    if (!db) {
                        let newdb = new client.models.userInventories({
                            user_id: message.author.id,
                            inventory: []
                        });
                        newdb.save(err => {
                            if (err) return reject(err);
                            return resolve();
                        });
                    } else return resolve();
                }
            );
        });
    }

    guildSettings(client, message) {
        return new Promise((resolve, reject) => {
            client.models.guildSettings.findOne({
                "guild_id": message.guild.id
            }, (err, db) => {
                if (err) return reject(err);
                if (!db) {
                    let newdb = new client.models.guildSettings({
                        guild_id: message.guild.id
                    });
                    newdb.save((err) => {
                        if (err) return reject(err);
                        else return resolve();
                    });
                } else return resolve();
            });
        });
    }
}

class suggestion {
    constructor(client, message) {
        this.client = client;
        this.message = message;
    }

    init() {
        return new Promise((resolve, reject) => {
            if (suggestionCooldown.has(this.message.author.id)) {
                this.message.delete();
                this.message.author.send(
                    `Your recent message in #suggestions has been removed as you are on cooldown. The cooldown lasts 30 seconds. Here is your suggestion in case you need it:\n \`\`\`${
            this.message.content
          }\`\`\``
                );
                return resolve();
            } else {
                suggestionCooldown.add(this.message.author.id);
                var reference_id = this.client.modules.random_string({
                    length: 10,
                    type: "base64"
                })
                this.message.channel
                    .send(
                        new this.client.modules.Discord.MessageEmbed()
                        .setColor(this.message.guild.me.displayHexColor)
                        .setTitle(`Suggestion from **${this.message.author.tag}**:`)
                        .setThumbnail(this.message.author.avatarURL())
                        .setDescription(this.message.content)
                        .setTimestamp()
                        .setFooter(reference_id)
                    )
                    .then(msg => {
                        this.message.delete();
                        msg
                            .react(this.client.storage.emojiCharacters["white_check_mark"])
                            .then(() => msg.react(this.client.storage.emojiCharacters["x"]));
                        let db = new this.client.models.suggestionsData({
                            reference_id: reference_id,
                            user_id: this.message.author.id,
                            message_id: msg.id,
                            suggestion_desc: this.message.content
                        })
                        db.save(err => {
                            if (err) return reject(err);
                        });
                        setTimeout(() => {
                            suggestionCooldown.delete(this.message.author.id);
                        }, 30000);
                        return resolve();
                    });
            }
        });
    }
}

class dbfunctions {
    constructor(client, message) {
        this.client = client;
        this.message = message;
    }

    checkXPtoLevel(level = 0, xp = 0) {
        let amountToLevel = level * 1000;
        if (xp >= amountToLevel) {
            return true;
        } else return false;
    }

    checkSettings(setting = "") {
        return new Promise((resolve, reject) => {
            this.client.models.userSettings.findOne({
                    user_id: this.message.author.id
                },
                (err, db) => {
                    if (err) return reject(err);
                    if (!db) return reject(`No database found while checking settings`)
                    if (!db.options.find(x => x.name == setting))
                        return reject(
                            `Attempted to find setting ${setting} in message.js event but failed`
                        );
                    return db.options.find(x => x.name == setting).boolean == true ?
                        resolve(true) :
                        resolve(false);
                }
            );
        });
    }
}

class ticket extends dbfunctions {
    constructor(client, message) {
        super(client, message);
        this.client = client;
        this.message = message;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.client.models.supportTickets.findOne({
                    channel_id: this.message.channel.id
                },
                async (err, db) => {
                    if (err) return reject(err);
                    if (!db)
                        return reject(
                            `User typing in channel found in SUPPORT TICKETS but no SUPPORT TICKET DATABASE ENTRY can be found! (${
                this.message.channel.name
              } ${this.message.channel.id})`
                        );
                    if (await this.checkSettings('ticket_mentioning')) {
                        if (this.message.author.id !== db.user_id) {
                            if (this.message.mentions.users.first()) {
                                if (this.message.mentions.users.first().id !== db.user_id) {
                                    this.message.channel
                                        .send(`<@${db.user_id}>`)
                                        .then(msg => setTimeout(() => msg.delete(), 10));
                                }
                            } else {
                                this.message.channel
                                    .send(`<@${db.user_id}>`)
                                    .then(msg => setTimeout(() => msg.delete(), 10));
                            }
                        }
                    }
                    db.logs.push({
                        user_id: this.message.author.id,
                        message_id: this.message.id,
                        message_content: this.message.content,
                        timestamp: this.message.createdTimestamp
                    });
                    db.save(err => {
                        if (err) return reject(err);
                    });
                    return resolve();
                }
            );
        });
    }
}

class handledb extends dbfunctions {
    constructor(client, message) {
        super(client, message);
        this.client = client;
        this.message = message;
        this.run(client, message);
    }

    async run(client, message) {
        const xp = await this.addXP(client).catch(err =>
            new client.methods.log(client).error(err)
        );
        const level = await this.checkLevel(client, message).catch(err =>
            new client.methods.log(client).error(err)
        );
        const coins = await this.addCoins(client).catch(err =>
            new client.methods.log(client).error(err)
        );
        client.models.userProfiles.findOne({
            "user_id": message.author.id
        }, (err, db) => {
            if (err) return new client.methods.log(client).error(err);
            db.user_xp += xpCooldown.has(message.author.id) ? 0 : xp.xp;
            db.user_level = level == true ? db.user_level + 1 : db.user_level;
            db.user_coins += coins == 0 ? 0 : coins.coin;
            db.message_count += 1;
            db.save((err) => {
                if (err) return new client.methods.log(client).error(err);
                else {
                    xpCooldown.add(message.author.id);
                    setTimeout(() => {
                        xpCooldown.delete(message.author.id);
                    }, client.functions.genNumberBetween(10000, 20000))
                    new client.methods.achievementHandler(client, message.author, 'updateXP', {
                        positive: true,
                        xp: xp.xp
                    }).handle();
                    new client.methods.achievementHandler(client, message.author, 'updateLevel').handle();
                    if (coins.coin !== 0) {
                        new client.methods.achievementHandler(client, message.author, 'updateCoins', {
                            positive: true,
                            coins: coins.coin
                        }).handle();
                    }
                    new client.methods.achievementHandler(client, message.author, 'updateMC').handle();
                }
            });
        });
        if (await this.checkSettings("xp_ping")) {
            if (xpCooldown.has(message.author.id)) return;
            message.channel
                .send(`<@${message.author.id}> **+${xp.xp} XP** ${xp.boost !== 0 ? `*(+${(xp.boost * 100) / 100} XP from ${xp.boostperc}% boost!)*` : ''}`)
                .then(msg => setTimeout(() => msg.delete(), xp.boost !== 0 ? 5000 : 2500));

        }
        if (await this.checkSettings('coin_ping')) {
            if (coins.coin !== 0) {
                message.channel
                    .send(`<@${message.author.id}> **+${coins.coin} Coins** ${coins.boost !== 0 ? `*(+${(coins.boost * 100) / 100} Coins from ${coins.boostperc}% boost!)*` : ''}`)
                    .then(msg => setTimeout(() => msg.delete(), coins.boost !== 0 ? 5000 : 2500));
            }
        }
    }

    addXP(client) {
        return new Promise((resolve, reject) => {
            let xp = client.functions.genNumberBetween(1, 20);
            let boost = 0;
            client.models.guildSettings.findOne({
                "guild_id": this.message.guild.id
            }, (err, db) => {
                if (err) return reject(err);
                if (!db) return;
                if (db.xp_booster.length > 0) {
                    for (const no of db.xp_booster) {
                        boost += no.percent;
                    }
                    let boostamount = parseFloat((xp * (boost / 100)).toFixed(2));
                    return resolve({
                        xp: xp + boostamount,
                        boost: boostamount,
                        boostperc: boost
                    });
                } else return resolve({
                    xp: xp,
                    boost: 0,
                    boostperc: 0
                });
            });
        });
    }

    checkLevel(client, message) {
        return new Promise(async (resolve, reject) => {
            client.models.userProfiles.findOne({
                    user_id: message.author.id
                },
                async (err, db) => {
                    if (err) return reject(err);
                    if (await this.checkXPtoLevel(db.user_level, db.user_xp)) {
                        message.channel.send(
                            new client.modules.Discord.MessageEmbed()
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`<@${message.author.id}>! You have reached **${db.user_level * 1000} XP** and have ranked up to **Level ${db.user_level + 1}**!`)
                        );
                        new client.methods.log(client, message.guild).levelUp(message.author, db.user_level);
                        return resolve(true);
                    } else return resolve(false);
                }
            );
        });
    }

    addCoins(client) {
        return new Promise((resolve, reject) => {
            let coin = 0;
            let boost = 0;
            if (client.functions.percentChance(35)) {
                coin = client.functions.genNumberBetween(1, 10);
            }
            client.models.guildSettings.findOne({
                "guild_id": this.message.guild.id
            }, (err, db) => {
                if (err) return reject(err);
                if (db.coin_booster.length > 0) {
                    for (const no of db.coin_booster) {
                        boost += no.percent;
                    }
                    let boostamount = parseFloat((coin * (boost / 100)).toFixed(2));
                    if (boostamount == 0) return resolve(false);
                    return resolve({
                        coin: coin + boostamount,
                        boost: boostamount,
                        boostperc: boost
                    });
                } else return resolve({
                    coin: coin,
                    boost: 0,
                    boostperc: 0
                });
            });
        });
    }
}

module.exports = async (client, message) => {
    if (message.channel.type !== "text") return;
    if (message.author.id == client.user.id) return;
    if (message.author.bot) return;
    await new checkdb(client, message).dbInit(client, message);
    if (message.content.toString().startsWith(client.commandHandler.prefix[0])) {
        if (message.channel.name == "suggestions") return message.delete();
        let args = message.content.split(" ");
        let command = args[0];
        let cmd = client.commandHandler.getCommand(command);
        if (!cmd) return;
        try {
            cmd.run(client, message, args);
            return new client.methods.log(client, message.guild).commandRan(
                message.author,
                cmd.name,
                message
            );
        } catch (err) {
            return new client.methods.log(client).error(err);
        }
    } else {
        if (message.channel.name == "suggestions") {
            new suggestion(client, message)
                .init()
                .catch(err => new client.methods.log(client).error(err));
        }
        if (message.channel.parent.name == "Support Tickets") {
            new ticket(client, message)
                .init()
                .catch(err => new client.methods.log(client).error(err));
        }
        return new handledb(client, message);
    }
};
