module.exports = class inventory {
    constructor() {
        this.name = 'inventory',
        this.alias = ["inv"],
        this.usage = '-inventory',
        this.category = 'user',
        this.description = 'Manage your inventory',
        this.items = require(`../storage`).inventoryItems
    }

    /*
    ITEMS:

    1 => VIP Role
    2 => XP Pouch - 10 XP
    3 => XP Pouch - 50 XP
    4 => XP Pouch - 100 XP
    5 => XP Pouch - 250 XP
    6 => XP Pouch - 500 XP
    7 => XP Pouch - 1000 XP
    8 => XP Pouch - 2000 XP
    9 => XP Crate - 10-50 XP
    10 => XP Crate - 50-100 XP
    11 => XP Crate - 100-250 XP
    12 => XP Crate - 250-500 XP
    13 => XP Crate - 500-1000 XP
    14 => XP Crate - 1000-2000 XP
    15 => XP Crate - 10-2000 XP
    16 => Coin Pouch - 1 Coin
    17 => Coin Pouch - 2 Coins
    18 => Coin Pouch - 5 Coins
    19 => Coin Pouch - 10 Coins
    20 => Coin Pouch - 25 Coins
    21 => Coin Pouch - 50 Coins
    22 => Coin Pouch - 100 Coins
    23 => Coin Pouch - 200 Coins
    24 => Coin Pouch - 500 Coins
    25 => Coin Pouch - 1000 Coins
    26 => Coin Crate - 1-2 Coins
    27 => Coin Crate - 2-5 Coins
    28 => Coin Crate - 5-10 Coins
    29 => Coin Crate - 10-25 Coins
    30 => Coin Crate - 25-50 Coins
    31 => Coin Crate - 50-100 Coins
    32 => Coin Crate - 100-200 Coins
    33 => Coin Crate - 200-500 Coins
    34 => Coin Crate - 500-1000 Coins
    35 => Coin Crate - 1-1000 Coins

    */

    resolveToName(id) {
        return this.items.find(x => x.id == id).name;
    }

    resolveToEmbedName(id) {
        return `[${this.resolveToName(id)}](https://sintyx.com/ "${this.resolveToDesc(id)}")`;
    }

    resolveToDesc(id) {
        return this.items.find(x => x.id == id).desc;
    }

    resolveNameToID(name) {
        return this.items.find(x => x.name == name).id;
    }

    resolveDescToID(desc) {
        return this.items.find(x => x.desc == desc).id;
    }

    async run(client, message, args) {
        /*

        Run command
        Sends embed:
            displays inventory content
            options:
                ONE - use item
                TWO - send item
                THREE - delete item(s)
        
        ONE =>
            send inventory, add reactions based on items that are usable and X reaction to close menu
            click reaction to use item, runs confirmation, removes 1x amount - if amount reaches 0 reaction is removed and embed is updated
        TWO =>
            send inventory, add reactions based on items that are sendable
            click reaction on item that you want to send, then posts embed asking amount to send (shows how much you have)
            asks for user you want to send to
            removes amount from their inventory, adds to other inventory
        THREE =>
            send inventory, add reactions based on deletable items
            click reaction on item you want to delete, then posts embed asking for amount to delete (shows how much you have)
            confirmation
            removes amount from their inventory
        */
        client.models.userInventories.findOne({
            "user_id": message.author.id
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                let newdb = new client.models.userInventories({
                    user_id: message.author.id,
                    inventory: []
                });
                newdb.save((err) => {
                    if (err) return console.error(err);
                });
                return message.channel.send("We found that you did not have an inventory... so we created you one. Please run the command again.");
            }
            if (db.inventory.length == 0) return message.channel.send(new client.modules.Discord.MessageEmbed().setColor(message.guild.member(client.user).displayHexColor).setDescription(`Your inventory is currently empty.`)).then(msg => setTimeout(() => {
                msg.delete();
                message.delete();
            }, 15000));
            let inv = db.inventory,
                i = 0,
                items = []
            for (let count in inv) {
                if (i >= inv.length) {
                    let embed = {
                        embed: {
                            color: message.guild.member(client.user).displayHexColor,
                            title: `${message.author.username}${message.author.username.endsWith('s') ? `'` : `'s`} Inventory:`,
                            description: `** ** \n:one: Use item\n:two: Send an item to another user\n:three: Delete an item\n** ** `,
                            fields: [{
                                name: `Item:`,
                                value: items.map(i => `[${i.name}](https://sintyx.com "${i.desc}")`).join(`\n`),
                                inline: true
                            }, {
                                name: `Amount:`,
                                value: items.map(i => `${i.amount}`).join(`\n`),
                                inline: true
                            }]
                        }
                    }
                    message.channel.send(embed).then(msg => {
                        this.initInventory(client, message, args, msg, db, items);
                    });
                    break;
                }
                items.push({
                    name: this.resolveToName(inv[count].id),
                    desc: this.resolveToDesc(inv[count].id),
                    amount: inv[count].amount
                });
                i++;
            }
        });
    }

    initInventory(client, message, args, msg, db, items) {
        msg.react(`1⃣`).then(() => msg.react(`2⃣`).then(() => msg.react(`3⃣`).then(() => msg.react(`❌`))));
        let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => ((reaction.emoji.name == '1⃣') || (reaction.emoji.name == '2⃣') || (reaction.emoji.name == '3⃣') || (reaction.emoji.name == '❌')) && user.id == message.author.id, {});
        collector.on('collect', reaction => {
            collector.stop();
            if (reaction.emoji.name == '1⃣') {
                msg.delete();
                let embed = {
                    embed: {
                        color: message.guild.member(client.user).displayHexColor,
                        title: `${message.author.username}${message.author.username.endsWith(`s`) ? `'` : `'`} Inventory: **Use an item**`,
                        description: `> Please respond with the ID of the item to use\n** ** `,
                        fields: []
                    }
                },
                    i = 0,
                    inv = db.inventory,
                    fields = [];
                for (let count in inv) {
                    if (i >= inv.length) {
                        break;
                    }
                    if (this.checkItemUsable(inv[count].id) == true) {
                        fields.push({
                            id: count,
                            item: `[${this.resolveToName(inv[count].id)}](https://sintyx.com/ "${this.resolveToDesc(inv[count].id)}")`,
                            amount: inv[count].amount,
                            name: this.resolveToName(inv[count].id)
                        });
                    } else {
                        continue;
                    }
                    i++;
                }
                embed.embed.fields.push({
                    name: 'ID',
                    value: fields.map(i => `${i.id}`).join(`\n`),
                    inline: true
                }, {
                    name: 'Item',
                    value: fields.map(i => `${i.item}`).join(`\n`),
                    inline: true
                }, {
                    name: 'Amount',
                    value: fields.map(i => `${i.amount}`).join(`\n`),
                    inline: true
                });
                message.channel.send(embed).then(msg => {
                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                    collector.on('collect', id => {
                        if (fields.find(x => x.id == `${id}`)) {
                            collector.stop();
                            id.delete();
                            msg.delete();
                            this.handleUseItem(client, message, this.resolveNameToID(fields.find(x => x.id == `${id}`).name));
                        }
                    });
                });
            }
            if (reaction.emoji.name == '2⃣') {

            }
            if (reaction.emoji.name == '3⃣') {

            }
            if (reaction.emoji.name == '❌') {
                msg.delete();
                message.delete();
            }
        });
    }

    checkItemUsable(id) {
        if (this.items.find(x => x.id == id).usable == true) {
            return true;
        } else return false;
    }

    handleUseItem(client, message, id) {
        // ROLE HANDLER
        if (this.items.find(x => x.id == id).type == 1) {
            this.confirmUseItem(client, message, id).then(boolean => {
                if (boolean == true) {
                    message.member.roles.add([message.guild.roles.find(x => x.name == this.items.find(x => x.id == id).reward[0].role_name).id]).then(() => {
                        client.models.userInventories.findOne({
                            "user_id": message.author.id
                        }, (err, db) => {
                            if (err) return console.error(err);
                            message.channel.send(new client.modules.Discord.MessageEmbed()
                                .setColor(message.guild.member(client.user).displayHexColor)
                                .setDescription(`> Claimed [${this.resolveToName(id)}](https://sintyx.com "${this.resolveToDesc(id)}")\nYou have been awarded the ${roles[id]} role!\nYou have ${parseInt(db.inventory.find(x => x.id == id).amount) - 1} of this item left in your inventory.`)
                            );
                            db.inventory.find(x => x.id == id).amount = parseInt(db.inventory.find(x => x.id == id).amount) - 1;
                            db.save((err) => {
                                if (err) return console.error(err);
                                client.functions.inventoryCheckAmount(client, id, message.author.id);
                            });
                        });
                    }).catch(err => {
                        message.channel.send(`Unfortunately, you cannot claim this item:\n\`\`\`${err}\`\`\``);
                        console.error(err);
                    });
                } else {
                    return;
                }
            });
        }
        // POUCH HANDLER
        if (this.items.find(x => x.id == id).type == 2) {
            this.confirmUseItem(client, message, id).then(boolean => {
                if (boolean == true) {
                    if (this.items.find(x => x.id == id).reward[0].type == 'XP') {
                        this.handlePouch(client, message, id, 'XP');
                    }
                    if (this.items.find(x => x.id == id).reward[0].type == 'COIN') {
                        this.handlePouch(client, message, id, 'COIN');
                    }
                } else {
                    return;
                }
            })
        }
        // CRATE HANDLER
        if (this.items.find(x => x.id == id).type == 3) {
            this.confirmUseItem(client, message, id).then(boolean => {
                if (boolean == true) {
                    this.handleCrate(client, message, id);
                } else {
                    return;
                }
            })
        }
    }

    handlePouch(client, message, id, type) {
        client.models.userInventories.findOne({
            "user_id": message.author.id
        }, (err, db) => {
            if (err) return console.error(err);
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`> Claimed ${this.resolveToEmbedName(id)}\nYou have been awarded ${this.items.find(x => x.id == id).reward[0].amount} ${type == 'COIN' ? (this.items.find(x => x.id == id).reward[0].amount > 1 ? 'Coins' : 'Coin') : 'XP'}\nYou have ${parseInt(db.inventory.find(x => x.id == id).amount) - 1} of this item left in your inventory.`)
            );
            db.inventory.find(x => x.id == id).amount = parseInt(db.inventory.find(x => x.id == id).amount) - 1;
            db.save((err) => {
                if (err) return console.error(err);
                client.functions.inventoryCheckAmount(client, id, message.author.id);
            });
            client.models.userProfiles.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return console.error(err);
                if (type == 'XP') {
                    db.user_xp += this.items.find(x => x.id == id).reward[0].amount;
                }
                if (type == 'COIN') {
                    db.user_coins += this.items.find(x => x.id == id).reward[0].amount;
                }
                db.save((err) => console.error(err));
            });
        })
    }

    handleCrate(client, message, id) {
        /*
        CRATE SYSTEM PLAN:

        send embed =>
            opening crate...
            react with 5 boxes
            generate 5 rewards between low and high, assign each to reaction
            react to one reaction
        -- delete embed
        send embed =>
            reward: your reward
            display other boxes rewards
            You have X of this item left in your inventory

        */
        if (this.items.find(x => x.id == id).reward[0].type == 'XP') {
            this.handleCrateOpening(client, message, id, 'XP');
        }
        if (this.items.find(x => x.id == id).reward[0].type == 'COIN') {
            this.handleCrateOpening(client, message, id, 'COIN');
        }
    }

    handleCrateOpening(client, message, id, type) {
        let emojis = ["☮", "☸", "✡", "🕎", "⚛"],
            rewards = [];
        message.channel.send(new client.modules.Discord.MessageEmbed()
            .setColor(message.guild.member(client.user).displayHexColor)
            .setDescription(`> You have opened an ${this.resolveToEmbedName(id)}!\nBelow, please choose from one of the boxes, this will be your reward.`)
        ).then(msg => {
            emojis.forEach(emoji => {
                msg.react(emoji);
                rewards.push({
                    id: emoji,
                    reward: client.functions.genNumberBetween(this.items.find(x => x.id == id).reward[0].low, this.items.find(x => x.id == id).reward[0].high)
                });
            });
            let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => ((reaction.emoji.name == emojis[0]) || (reaction.emoji.name == emojis[1]) || (reaction.emoji.name == emojis[2]) || (reaction.emoji.name == emojis[3]) || (reaction.emoji.name == emojis[4])) && user.id == message.author.id, {});
            collector.on('collect', reaction => {
                collector.stop();
                msg.delete();
                client.models.userInventories.findOne({
                    "user_id": message.author.id
                }, (err, db) => {
                    if (err) return console.error(err);
                    message.channel.send(new client.modules.Discord.MessageEmbed()
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .setDescription(`> You opened a ${this.resolveToEmbedName(id)} and received: **${rewards.find(x => x.id == reaction.emoji.name).reward} ${type == 'COIN' ? (rewards.find(x => x.id == reaction.emoji.name).reward > 1 ? 'Coins' : 'Coin') : 'XP'}**
                        ${rewards.filter(x => x.id !== reaction.emoji.name).map(i => `${i.id} - ${i.reward} XP`).join(`\n`)}

                        You have ${db.inventory.find(x => x.id == id).amount - 1} of this item left`)
                    );
                    client.models.userProfiles.findOne({
                        "user_id": message.author.id
                    }, (err, db) => {
                        if (err) return console.error(err);
                        if (type == 'XP') {
                            db.user_xp += rewards.find(x => x.id == reaction.emoji.name).reward;
                        }
                        if (type == 'COIN') {
                            db.user_coins += rewards.find(x => x.id == reaction.emoji.name).reward;
                        }
                        db.save((err) => console.error(err));
                    });
                    db.inventory.find(x => x.id == id).amount = db.inventory.find(x => x.id == id).amount - 1;
                    db.save((err) => {
                        if (err) return console.error(err);
                        client.functions.inventoryCheckAmount(client, id, message.author.id);
                    });
                })
            })
        })
    }

    confirmUseItem(client, message, id) {
        return new Promise(async(resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setTitle(`Confirmation...`)
                .setDescription(`Are you sure you want to claim your ${this.resolveToEmbedName(id)}? Claiming this item is irreversible!`)
                .setColor(message.guild.member(client.user).displayHexColor)
            ).then(msg => {
                msg.react(`✅`).then(msg.react(`❌`));
                let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => ((reaction.emoji.name == '✅') || (reaction.emoji.name == '❌')) && user.id == message.author.id, {});
                collector.on('collect', reaction => {
                    collector.stop();
                    if (reaction.emoji.name == '✅') {
                        msg.delete();
                        resolve(true);
                    } else {
                        msg.delete();
                        resolve(false);
                    }
                });
            });
        });
    }
}