module.exports = class shop {
    constructor() {
        this.name = 'shop',
            this.alias = ["store"],
            this.usage = '-shop',
            this.category = 'user',
            this.description = 'Purchase items from the shop!'
    }

    sortDocs(client) {
        return new Promise((resolve, reject) => {
            client.models.shopData.find({}).lean().exec((err, docs) => {
                if (err) return reject(err);
                for (const count in docs) {
                    let id = docs[count].item_id;
                    client.models.shopData.findOne({
                        "item_id": id
                    }, (err, db) => {
                        if (err) return reject(err);
                        db.item_id = count;
                        db.save((err) => {
                            if (err) return reject(err);
                        });
                    });
                }
                return resolve();
            });
        });
    }

    getCoins(client, id) {
        return new Promise((resolve, reject) => {
            client.models.userProfiles.findOne({
                "user_id": id
            }, (err, db) => {
                if (err) return reject(err);
                if (!db) return reject(`No userProfiles DB`);
                return resolve(db.user_coins);
            });
        });
    }

    getInventoryItemName(id) {
        return new Promise((resolve, reject) => {
            const storage = require(`../storage`);
            const items = storage.inventoryItems;
            return resolve(items.find(x => x.id == id).name);
        });
    }

    openShop(client, message) {
        return new Promise((resolve, reject) => {
            client.models.shopData.find({}).lean().exec(async (err, docs) => {
                if (err) return reject(err);
                if (!docs[0]) return message.channel.send(`Unfortunately, the shop is currently empty... please check back later!`);
                let items = [];
                let amounts = [];
                let costs = [];
                for (const count in docs) {
                    const invName = await this.getInventoryItemName(docs[count].inventory_id);
                    items.push(`\`${docs[count].item_id}\` ${invName}`);
                    amounts.push(`${docs[count].item_amount}`);
                    costs.push(`${docs[count].item_price} Coins`);
                }
                let embed = {
                    embed: {
                        color: message.guild.me.displayHexColor,
                        title: `**The Shop**`,
                        description: `You currently have ${await this.getCoins(client, message.author.id)} Coins available!\n** **\n> Reply with the item number you wish to buy\n** **`,
                        fields: [{
                            name: 'Item',
                            value: items.join(`\n`),
                            inline: true
                        }, {
                            name: 'Amount',
                            value: amounts.join(`\n`),
                            inline: true
                        }, {
                            name: 'Cost',
                            value: costs.join(`\n`),
                            inline: true
                        }]
                    }
                }
                const msg = await message.channel.send(embed);
                msg.react(`❌`);
                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                    max: 1
                });
                let c = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => reaction.emoji.name == '❌' && user.id == message.author.id, {});
                c.on('collect', reaction => {
                    collector.stop();
                    c.stop();
                    msg.delete();
                });
                collector.on('collect', itemno => {
                    client.models.shopData.findOne({
                        "item_id": itemno
                    }, async (err, db) => {
                        if (err) return reject(err);
                        if (!db) {
                            itemno.delete();
                            return message.channel.send(`:x: This item could not be found on the shop! Please type the item number you wish to purchase again.`).then(m => setTimeout(() => m.delete(), 2500));
                        } else {
                            collector.stop();
                            itemno.delete();
                            msg.delete();
                            if (await this.getCoins(client, message.author.id) >= db.item_price) {
                                this.confirmPurchase(client, message, db).then(async b => {
                                    if (b) {
                                        await this.takeCoins(client, message.author, db.item_price).catch(err => reject(err));
                                        await this.addToInventory(db.inventory_id, db.item_amount, client, message).catch(err => reject(err));
                                        const coinsLeft = await this.getCoins(client, message.author.id);
                                        message.channel.send(new client.modules.Discord.MessageEmbed()
                                            .setColor(message.guild.me.displayHexColor)
                                            .setDescription(`> Purchased **${db.item_amount}x ${await this.getInventoryItemName(db.inventory_id)}** for **${db.item_price} Coins**\nYou have ${coinsLeft} Coins remaining in your balance.`)
                                        );
                                    } else return;
                                });
                            } else {
                                return message.channel.send(`:x: You do not have enough coins to purchase this item...`).then(m => setTimeout(() => m.delete(), 2500));
                            }
                        }
                    });
                });
            });
        });
    }

    takeCoins(client, user, coins) {
        return new Promise((resolve, reject) => {
            client.models.userProfiles.findOne({
                "user_id": user.id
            }, (err, db) => {
                if (err) return reject(err);
                db.user_coins -= coins;
                db.save((err) => {
                    if (err) return reject(err);
                    else {
                        resolve();
                        new client.methods.achievementHandler(client, user, 'updateCoins', {
                            positive: false,
                            coins: coins
                        }).handle()
                    }
                });
            });
        });
    }

    addToInventory(id, amount, client, message) {
        return new Promise((resolve, reject) => {
            client.models.userInventories.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return reject(err);
                if (!db.inventory.find(x => x.id == id)) {
                    db.inventory.push({
                        id: id,
                        amount: amount
                    });
                    db.save((err) => {
                        if (err) return reject(err);
                        else return resolve();
                    });
                } else {
                    db.inventory.find(x => x.id == id).amount += amount;
                    db.save((err) => {
                        if (err) return reject(err);
                        else return resolve();
                    });
                }
            });
        });
    }

    confirmPurchase(client, message, db) {
        return new Promise(async (resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(`Are you sure you want to purchase **${db.item_amount}x ${await this.getInventoryItemName(db.inventory_id)}** for **${db.item_price} Coins** from The Shop?`)
            ).then(msg => {
                msg.react(client.storage.emojiCharacters['white_check_mark']).then(() => msg.react(client.storage.emojiCharacters['x']));
                let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => ((reaction.emoji.name == client.storage.emojiCharacters['white_check_mark']) || (reaction.emoji.name == client.storage.emojiCharacters['x'])) && user.id == message.author.id, {});
                collector.on('collect', reaction => {
                    msg.delete();
                    if (reaction.emoji.name == client.storage.emojiCharacters['white_check_mark']) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                });
            });
        });
    }

    addingGetItem(client, message) {
        return new Promise((resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(`What inventory ID do you want to add to the shop?`)
            ).then(msg => {
                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                collector.on('collect', id => {
                    collector.stop();
                    id.delete();
                    id.content = parseInt(id.content);
                    msg.delete();
                    return resolve(id.content);
                });
            });
        });
    }

    addingGetAmount(client, message) {
        return new Promise((resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(`How many of this item do you want to be sold at a time?`)
            ).then(msg => {
                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                collector.on('collect', amount => {
                    collector.stop();
                    amount.delete();
                    amount.content = parseInt(amount.content);
                    msg.delete();
                    return resolve(amount.content);
                });
            });
        });
    }

    addingGetCost(client, message) {
        return new Promise((resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(`How much do you want to charge for this item?`)
            ).then(msg => {
                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                collector.on('collect', cost => {
                    collector.stop();
                    cost.delete();
                    cost.content = parseInt(cost.content);
                    msg.delete();
                    return resolve(cost.content);
                });
            });
        });
    }

    getAmountOfDocs(client) {
        return new Promise((resolve, reject) => {
            client.models.shopData.find({}).lean().exec((err, docs) => {
                if (err) return reject(err);
                return resolve(docs.length);
            });
        });
    }

    async handleAdding(client, message) {
        const item = await this.addingGetItem(client, message).catch(err => new client.methods.log(client).error(err));
        const amount = await this.addingGetAmount(client, message).catch(err => new client.methods.log(client).error(err));
        const cost = await this.addingGetCost(client, message).catch(err => new client.methods.log(client).error(err));
        const doclength = await this.getAmountOfDocs(client).catch(err => new client.methods.log(client).error(err));
        let newdb = new client.models.shopData({
            item_id: doclength + 1,
            item_price: cost,
            item_amount: amount,
            inventory_id: item
        });
        newdb.save((err) => {
            if (err) return new client.methods.log(client).error(err);
            else return this.sortDocs(client);
        });
    }

    deletingGetItem(client, message) {
        return new Promise((resolve, reject) => {
            client.models.shopData.find({}).lean().exec(async (err, docs) => {
                if (err) return reject(err);
                let items = [];
                for (const count in docs) {
                    const name = await this.getInventoryItemName(docs[count].inventory_id);
                    items.push(`\`${docs[count].item_id}\` ${name}`);
                }
                message.channel.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.me.displayHexColor)
                    .setDescription(`What item do you want to remove?`)
                    .addField(`Items:`, items.join(`\n`))
                ).then(msg => {
                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                    collector.on('collect', item => {
                        collector.stop();
                        item.delete();
                        msg.delete();
                        item.content = parseInt(item.content);
                        return resolve(item.content);
                    });
                });
            });
        });
    }

    async handleDeleting(client, message) {
        const item = await this.deletingGetItem(client, message).catch(err => new client.methods.log(client).error(err));
        client.models.shopData.findOne({
            "item_id": item
        }, (err, db) => {
            if (err) return new client.methods.log(client).error(err);
            if (!db) return new client.methods.log(client).error(`Item cannot be found in database`);
            client.models.shopData.findOneAndRemove({
                "item_id": item
            }, (err, db) => {
                if (err) return new client.methods.log(client).error(err);
                message.channel.send(`Removed shop item ID ${item}!`);
                this.sortDocs(client);
            });
        });
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        if (!args[1]) {
            this.openShop(client, message).catch(err => new client.methods.log(client).error(err));
        }
        if (args[1]) {
            if (!message.member.roles.find(x => x.name == "Management")) return;
            if (args[1].toLowerCase() == "add") {
                this.handleAdding(client, message);
            }
            if (args[1].toLowerCase() == "delete") {
                this.handleDeleting(client, message);
            }
            if (args[1].toLowerCase() == "del") {
                this.handleDeleting(client, message);
            }
            if (args[1].toLowerCase() == "remove") {
                this.handleDeleting(client, message);
            }
        }
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
