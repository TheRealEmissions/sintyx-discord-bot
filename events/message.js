let suggestionCooldown = new Set();

class checkdb {
    constructor(client, message) {
        this.dbInit(client, message);
    }

    async dbInit(client, message) {
        this.userProfiles(client, message);
        this.userSettings(client, message);
        this.userInventories(client, message);
    }

    userProfiles(client, message) {
        return new Promise((resolve, reject) => {
            client.models.userProfiles.findOne({
                    user_id: message.author.id
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
                    user_id: message.author.id
                },
                (err, db) => {
                    if (err) return reject(err);
                    if (!db) {
                        let newdb = new client.models.userSettings({
                            user_id: message.author.idd,
                            options: [{
                                    name: "coin_ping",
                                    boolean: false
                                },
                                {
                                    name: "xp_ping",
                                    boolean: false
                                },
                                {
                                    name: "ticket_mentioning",
                                    boolean: false
                                }
                            ]
                        });
                        newdb.save(err => {
                            if (err) return reject(err);
                            else return resolve();
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
                    user_id: message.author.id
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
        const coins = await this.addCoins(client, message).catch(err =>
            new client.methods.log(client).error(err)
        );
        client.models.userProfiles.findOne({
            "user_id": message.author.id
        }, (err, db) => {
            if (err) return new client.methods.log(client).error(err);
            db.user_xp += xp;
            db.user_level = level == true ? db.user_level + 1 : db.user_level;
            db.user_coins = coins == false ? db.user_coins : db.user_coins + coins;
            db.message_count += 1;
            db.save((err) => {
                if (err) return new client.methods.log(client).error(err);
            });
        });
        if (await this.checkSettings("xp_ping")) {
            message.channel
                .send(`<@${message.author.id}> **+${xp} XP**`)
                .then(msg => setTimeout(() => msg.delete(), 1800));

        }
        if (await this.checkSettings('coin_ping')) {
            if (coins !== false) {
                message.channel
                    .send(`<@${message.author.id}> **+${coins} Coins**`)
                    .then(msg => setTimeout(() => msg.delete(), 1800));
            }
        }
    }

    addXP(client) {
        return new Promise((resolve, reject) => {
            return resolve(client.functions.genNumberBetween(1, 20));
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

    addCoins(client, message) {
        return new Promise((resolve, reject) => {
            client.models.userProfiles.findOne({
                    user_id: message.author.id
                },
                async (err, db) => {
                    if (err) return reject(err);
                    if (client.functions.percentChance(35)) {
                        let coin = client.functions.genNumberBetween(1, 10);
                        return resolve(coin);
                    } else return resolve(false);
                }
            );
        });
    }
}

module.exports = (client, message) => {
    if (message.channel.type !== "text") return;
    if (message.author.id == client.user.id) return;
    if (message.author.bot) return;
    new checkdb(client, message);
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
