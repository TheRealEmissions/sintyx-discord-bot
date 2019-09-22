module.exports = class supply {
    constructor(client) {
        this.client = client;
    }

    async init() {
        const channel = await this.getChannel();
        const type = await this.generateType();
        const drop = await this.generateDrop(type);
        const msg = await this.incomingMessage(channel);
        switch (type) {
            case 'ID':
                this.inventorySupplyDrop(channel, msg, drop).catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'XP':
                this.xpSupplyDrop(channel, msg, drop).catch(err => new this.client.methods.log(this.client).error(err));
                break;
            case 'COIN':
                this.coinSupplyDrop(channel, msg, drop).catch(err => new this.client.methods.log(this.client).error(err));
                break;
        }
    }

    handleClaim(type, user, drop) {
        return new Promise((resolve, reject) => {
            if (type == 'ID') {
                this.client.models.userInventories.findOne({
                    "user_id": user.id
                }, (err, db) => {
                    if (err) return reject(err);
                    if (db.inventory.find(x => x.id == drop.id)) {
                        db.inventory.find(x => x.id == drop.id) += 1;
                    } else {
                        db.inventory.push({
                            id: drop.id,
                            amount: 1
                        });
                    }
                    db.save((err) => {
                        if (err) return reject(err);
                        else return resolve();
                    });
                });
            } else {
                this.client.models.userProfiles.findOne({
                    "user_id": user.id
                }, (err, db) => {
                    if (err) return reject(err);
                    if (type == 'XP') {
                        db.user_xp += drop;
                    }
                    if (type == 'COIN') {
                        db.user_coins += drop;
                    }
                    db.save((err) => {
                        if (err) return reject(err);
                        else {
                            if (type == 'XP') {
                                new this.client.methods.achievementHandler(this.client, user, 'updateXP', {
                                    positive: true,
                                    xp: drop
                                }).handle();
                            }
                            if (type == 'COIN') {
                                new this.client.methods.achievementHandler(this.client, user, 'updateCoins', {
                                    positive: true,
                                    coins: drop
                                }).handle();
                            }
                        }
                    });
                });
            }
        });
    }

    inventorySupplyDrop(channel, msg, item) {
        return new Promise(async (resolve, reject) => {
            let embed = {
                embed: {
                    color: channel.guild.member(this.client.user).displayHexColor,
                    title: `🪂 **Supply Drop** 🪂`,
                    description: `** ** \n**Click :white_check_mark: to claim!**\n** ** \n\`Inventory Item\`\n[${item.name}](https://sintyx.com/ "${item.desc}")`
                }
            }
            msg.edit(embed);
            let collector = await new this.client.modules.Discord.ReactionCollector(msg, (reaction, user) => reaction.emoji.name == '✅' && user.id !== this.client.user.id, {
                max: 1
            });
            msg.react(`✅`);
            collector.on('collect', (reaction, user) => {
                collector.stop();
                embed.embed.description = `** ** \n**Claimed by ${user}**\n** ** \n\`Inventory Item\`\n[${item.name}](https://sintyx.com/ "${item.desc}")`
                msg.edit(embed);
                this.handleClaim('ID', user, item);
                new this.client.methods.achievementHandler(this.client, user, 'claimSupplyDrop').handle();
                return resolve();
            });
        });
    }

    xpSupplyDrop(channel, msg, amount) {
        return new Promise(async (resolve, reject) => {
            let embed = {
                embed: {
                    color: channel.guild.member(this.client.user).displayHexColor,
                    title: `🪂 **Supply Drop** 🪂`,
                    description: `** ** \n**Click :white_check_mark: to claim!**\n** ** \n\`XP\`\n[${amount}](https://sintyx.com/)`
                }
            }
            msg.edit(embed);
            let collector = await new this.client.modules.Discord.ReactionCollector(msg, (reaction, user) => reaction.emoji.name == '✅' && user.id !== this.client.user.id, {
                max: 1
            });
            msg.react(`✅`);
            collector.on('collect', (reaction, user) => {
                collector.stop();
                embed.embed.description = `** ** \n**Claimed by ${user}**\n** ** \n\`XP\`\n[${amount}](https://sintyx.com/)`
                msg.edit(embed);
                this.handleClaim('XP', user, amount);
                return resolve();
            });
        });
    }

    coinSupplyDrop(channel, msg, amount) {
        return new Promise(async (resolve, reject) => {
            let embed = {
                embed: {
                    color: channel.guild.member(this.client.user).displayHexColor,
                    title: `🪂 **Supply Drop** 🪂`,
                    description: `** ** \n**Click :white_check_mark: to claim!**\n** ** \n\`Coins\`\n[${amount}](https://sintyx.com/)`
                }
            }
            msg.edit(embed);
            let collector = await new this.client.modules.Discord.ReactionCollector(msg, (reaction, user) => reaction.emoji.name == '✅' && user.id !== this.client.user.id, {
                max: 1
            });
            msg.react(`✅`);
            collector.on('collect', (reaction, user) => {
                collector.stop();
                embed.embed.description = `** ** \n**Claimed by ${user}**\n** ** \n\`Coins\`\n[${amount}](https://sintyx.com/)`
                msg.edit(embed);
                this.handleClaim('COIN', user, amount);
                return resolve();
            });
        });
    }

    getChannel(id = null) {
        return new Promise(async (resolve, reject) => {
            let channel;
            if (id == null) channel = await this.client.channels.fetch(this.client.storage.messageCache['supplyDropChannel'].id);
            else channel = await this.client.channels.fetch(id);
            if (!channel) return reject(`Channel could not be found in supplyDropHandler.js getChannel`);
            return resolve(channel);
        });
    }

    getInventoryObj(id) {
        return new Promise((resolve, reject) => {
            let obj = this.client.storage.inventoryItems.find(x => x.id == id);
            if (!obj) return reject(`Inventory object could not be found in getInventoryObj(id)`);
            return resolve(obj);
        });
    }

    generateType() {
        return new Promise((resolve, reject) => {
            let types = ['XP', 'COIN', 'ID'];
            const no = this.client.functions.genNumberBetween(1, 3);
            let type = types[no];
            if (!type) return reject(`Type could not be found on generateType in supplyDropHandler.js`)
            switch (type) {
                case 'XP':
                    resolve('XP');
                    break;
                case 'COIN':
                    resolve('COIN');
                    break;
                case 'ID':
                    resolve('ID');
                    break;
            }
        });
    }

    generateDrop(type) {
        return new Promise((resolve, reject) => {
            if (type == 'ID') {
                let itemID = this.client.storage.inventoryItems[this.client.functions.genNumberBetween(1, this.client.storage.inventoryItems.length)];
                return resolve(itemID);
            } else {
                let amount;
                if (type == 'XP') {
                    amount = this.client.functions.genNumberBetween(1, 1000);
                }
                if (type == 'COIN') {
                    amount = this.client.functions.genNumberBetween(1, 400);
                }
                return resolve(amount);
            }
        });
    }

    incomingMessage(channel) {
        return new Promise(async (resolve, reject) => {
            let embed = {
                embed: {
                    color: channel.guild.member(this.client.user).displayHexColor,
                    title: `🪂 **Supply Drop Incoming** 🪂`,
                    description: `Get ready to claim in **10 seconds**!`
                }
            }
            channel.send(embed).then(msg => {
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **9 seconds**!`;
                    msg.edit(embed);
                }, 1000);
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **8 seconds**!`;
                    msg.edit(embed);
                }, 2000);
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **7 seconds**!`;
                    msg.edit(embed);
                }, 3000);
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **6 seconds**!`;
                    msg.edit(embed);
                }, 4000);
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **5 seconds**!`;
                    msg.edit(embed);
                }, 5000);
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **4 seconds**!`;
                    msg.edit(embed);
                }, 6000);
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **3 seconds**!`;
                    msg.edit(embed);
                }, 7000);
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **2 seconds**!`;
                    msg.edit(embed);
                }, 8000);
                setTimeout(() => {
                    embed.embed.description = `Get ready to claim in **1 seconds**!`;
                    msg.edit(embed);
                }, 9000);
                setTimeout(() => {
                    return resolve(msg);
                }, 10000);
            });
        });
    }
}
