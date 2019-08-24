module.exports = class inventory {
    constructor() {
        this.name = 'inventory',
            this.alias = ["inv"],
            this.usage = '-inventory',
            this.category = 'user',
            this.description = 'Manage your inventory',
            this.items = require(`../storage`).inventoryItems
    }

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
            if (err) return new client.methods.log(client, message.guild).error(err);
            if (!db) {
                let newdb = new client.models.userInventories({
                    user_id: message.author.id,
                    inventory: []
                });
                newdb.save((err) => {
                    if (err) return new client.methods.log(client, message.guild).error(err);
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
                        this.initInventory(client, message, msg, db);
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

    initInventory(client, message, msg, db) {
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
                /*
                send inventory, what item to send
                amount of items
                user to send to
                confirm
                send
                */
                msg.delete();
                let embed = {
                        embed: {
                            color: message.guild.member(client.user).displayHexColor,
                            title: `${message.author.username}${message.author.username.endsWith(`s`) ? `'` : `'`} Inventory: **Send an item**`,
                            description: `> Please respond with the ID of the item you wish to send to another user\n** ** `,
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
                    fields.push({
                        id: count,
                        item: `${this.resolveToEmbedName(inv[count].id)}`,
                        amount: inv[count].amount,
                        name: this.resolveToName(inv[count].id)
                    });
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
                            this.handleSendItem(client, message, this.resolveNameToID(fields.find(x => x.id == `${id}`).name));
                        }
                    });
                });
            }
            if (reaction.emoji.name == '3⃣') {
                /*
                What item
                how many
                confirm
                delete
                */
                msg.delete();
                let embed = {
                        embed: {
                            color: message.guild.member(client.user).displayHexColor,
                            title: `${message.author.username}${message.author.username.endsWith(`s`) ? `'` : `'`} Inventory: **Delete an item**`,
                            description: `> Please respond with the ID of the item you wish to delete\n** ** `,
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
                    fields.push({
                        id: count,
                        item: `${this.resolveToEmbedName(inv[count].id)}`,
                        amount: inv[count].amount,
                        name: this.resolveToName(inv[count].id)
                    });
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
                            this.handleDeleteItem(client, message, this.resolveNameToID(fields.find(x => x.id == `${id}`).name));
                        }
                    });
                });
            }
            if (reaction.emoji.name == '❌') {
                msg.delete();
                message.delete();
            }
        });
    }

    handleDeleteItem(client, message, id) {
        this.fetchItemDeleteAmount(client, message, id).then((amount) => {
            this.confirmItemDelete(client, message, id, amount).then((boolean) => {
                if (boolean == true) {
                    client.models.userInventories.findOne({
                        "user_id": message.author.id
                    }, (err, db) => {
                        if (err) return new client.methods.log(client, message.guild).error(err);
                        db.inventory.find(x => x.id).amount = db.inventory.find(x => x.id).amount - amount;
                        db.save((err) => new client.methods.log(client, message.guild).error(err));
                        client.functions.inventoryCheckAmount(client, id, message.author.id);
                        message.channel.send(new client.modules.Discord.MessageEmbed()
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`Deleted ${amount}x ${this.resolveToEmbedName(id)} from your inventory`)
                        );
                    });
                } else {
                    return;
                }
            }).catch(err => {
                new client.methods.log(client, message.guild).error(err);
                message.channel.send(`We cannot complete the deletion process! Error: \`\`\`${err}\`\`\``);
            });
        }).catch(err => {
            new client.methods.log(client, message.guild).error(err);
            message.channel.send(`We cannot complete the deletion process! Error: \`\`\`${err}\`\`\``);
        });
    }

    fetchItemDeleteAmount(client, message, id) {
        return new Promise((resolve, reject) => {
            client.models.userInventories.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return reject(err);
                message.channel.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setDescription(`> You currently have ${db.inventory.find(x => x.id == id).amount} ${this.resolveToEmbedName(id)}\nHow many ${this.resolveToEmbedName(id)} do you want to delete?`)
                ).then(msg => {
                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                    collector.on('collect', amount => {
                        msg.delete();
                        if (!isNaN(parseInt(amount))) {
                            amount = parseInt(amount);
                            if (amount <= db.inventory.find(x => x.id == id).amount && amount > 0) {
                                return resolve(amount);
                            } else {
                                return reject(`Amount provided is either above inventory amount or below 1`);
                            }
                        } else {
                            return reject(`Amount provided is not a number`);
                        }
                    });
                });
            })
        });
    }

    confirmItemDelete(client, message, id, amount) {
        return new Promise((resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`Are you sure you want to delete ${amount}x ${this.resolveToEmbedName(id)}?`)
            ).then(msg => {
                msg.react(`✅`).then(() => msg.react(`❌`));
                let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => ((reaction.emoji.name == '✅') || (reaction.emoji.name == '❌')) && user.id == message.author.id, {});
                collector.on('collect', reaction => {
                    msg.delete();
                    if (reaction.emoji.name == '✅') {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
            });
        });
    }

    handleSendItem(client, message, id) {
        this.fetchItemSendingAmount(client, message, id).then((amount) => {
            this.fetchItemSendingUser(client, message, id, amount).then((usr) => {
                this.confirmSendItem(client, message, id, amount, usr).then((boolean) => {
                    if (boolean == true) {
                        // remove from user database
                        client.models.userInventories.findOne({
                            "user_id": message.author.id
                        }, (err, db) => {
                            if (err) return new client.methods.log(client, message.guild).error(err);
                            db.inventory.find(x => x.id == id).amount = db.inventory.find(x => x.id == id).amount - amount;
                            db.save((err) => new client.methods.log(client, message.guild).error(err));
                            client.functions.inventoryCheckAmount(client, id, message.author.id);
                        });
                        // add to new database
                        client.models.userInventories.findOne({
                            "user_id": usr.id
                        }, (err, db) => {
                            if (err) return new client.methods.log(client, message.guild).error(err);
                            if (db.inventory.find(x => x.id)) {
                                db.inventory.find(x => x.id).amount += amount;
                                db.save((err) => new client.methods.log(client, message.guild).error(err));
                            } else {
                                db.inventory.push({
                                    id: id,
                                    amount: amount
                                });
                                db.save((err) => new client.methods.log(client, message.guild).error(err));
                            }
                        });
                        message.channel.send(new client.modules.Discord.MessageEmbed()
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`Sent ${amount}x ${this.resolveToEmbedName(id)} to <@${usr.id}>`)
                        );
                        usr.send(new client.modules.Discord.MessageEmbed()
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`<@${message.author.id}> has sent you ${amount}x ${this.resolveToEmbedName(id)}! This has automatically been debited into your inventory.`)
                        );
                    } else {
                        return;
                    }
                })
            }).catch(err => {
                new client.methods.log(client, message.guild).error(err);
                message.channel.send(`We cannot complete the sending process! Error:\n\`\`\`${err}\`\`\``);
            });
        }).catch(err => {
            new client.methods.log(client, message.guild).error(err);
            message.channel.send(`We cannot complete the sending process! Error:\n\`\`\`${err}\`\`\``);
        });
    }

    fetchItemSendingAmount(client, message, id) {
        return new Promise((resolve, reject) => {
            client.models.userInventories.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return reject(err);
                message.channel.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setDescription(`> You currently have ${db.inventory.find(x => x.id == id).amount} ${this.resolveToEmbedName(id)}\nHow many of this item do you wish to send?`)
                ).then(msg => {
                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                    collector.on('collect', amount => {
                        collector.stop();
                        msg.delete();
                        if (!isNaN(parseInt(amount))) {
                            if (parseInt(amount) <= parseInt(db.inventory.find(x => x.id == id).amount) && parseInt(amount) > 0) {
                                return resolve(parseInt(amount));
                            } else {
                                return reject(`Cannot send more than inventory amount or less than 1`);
                            }
                        }
                    });
                });
            });
        });
    }

    fetchItemSendingUser(client, message, id, amount) {
        return new Promise((resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`What user do you want to send ${amount}x ${this.resolveToEmbedName(id)} to?`)
            ).then(msg => {
                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                collector.on('collect', user => {
                    user = user.mentions.users.first() ? user.mentions.users.first() : message.guild.members.get(user.content);
                    if (!user) {
                        return reject(`No user could be found`);
                    }
                    msg.delete();
                    return resolve(user);
                });
            });
        });
    }

    confirmSendItem(client, message, id, amount, user) {
        return new Promise((resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`Are you sure want to send ${amount}x ${this.resolveToEmbedName(id)} to <@${user.id}>?`)
            ).then(msg => {
                msg.react(`✅`).then(() => msg.react(`❌`));
                let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => ((reaction.emoji.name == '✅') || (reaction.emoji.name == '❌')) && user.id == message.author.id, {});
                collector.on('collect', reaction => {
                    msg.delete();
                    if (reaction.emoji.name == '✅') {
                        return resolve(true);
                    } else return resolve(false);
                });
            });
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
                            if (err) return new client.methods.log(client, message.guild).error(err);
                            db.inventory.find(x => x.id == id).amount = parseInt(db.inventory.find(x => x.id == id).amount) - 1;
                            db.save((err) => {
                                if (err) return new client.methods.log(client, message.guild).error(err);
                                client.functions.inventoryCheckAmount(client, id, message.author.id);
                                message.channel.send(new client.modules.Discord.MessageEmbed()
                                    .setColor(message.guild.member(client.user).displayHexColor)
                                    .setDescription(`> Claimed [${this.resolveToName(id)}](https://sintyx.com "${this.resolveToDesc(id)}")\nYou have been awarded the ${this.items.find(x => x.id == id).rewards[0].role_name} role!\nYou have ${parseInt(db.inventory.find(x => x.id == id).amount) - 1} of this item left in your inventory.`)
                                );
                            });
                        });
                    }).catch(err => {
                        message.channel.send(`Unfortunately, you cannot claim this item:\n\`\`\`${err}\`\`\``);
                        new client.methods.log(client, message.guild).error(err);
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
            if (err) return new client.methods.log(client, message.guild).error(err);
            db.inventory.find(x => x.id == id).amount = parseInt(db.inventory.find(x => x.id == id).amount) - 1;
            db.save((err) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                client.functions.inventoryCheckAmount(client, id, message.author.id);
                message.channel.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setDescription(`> Claimed ${this.resolveToEmbedName(id)}\nYou have been awarded ${this.items.find(x => x.id == id).reward[0].amount} ${type == 'COIN' ? (this.items.find(x => x.id == id).reward[0].amount > 1 ? 'Coins' : 'Coin') : 'XP'}\nYou have ${parseInt(db.inventory.find(x => x.id == id).amount)} of this item left in your inventory.${db.inventory.find(x => x.id == id).amount > 0 ? `\n ** ** \n:white_check_mark: **Claim another ${this.resolveToEmbedName(id)}**` : ''}`)
                ).then(msg => {
                    client.models.userInventories.findOne({
                        "user_id": message.author.id
                    }, (err, db) => {
                        if (err) return new client.methods.log(client, message.guild).error(err);
                        if (!db.inventory.find(x => x.id == id)) return;
                        if (db.inventory.find(x => x.id == id).amount > 0) {
                            msg.react(client.storage.emojiCharacters['white_check_mark']);
                            let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id == message.author.id, {
                                time: 120000
                            });
                            collector.on('collect', reaction => {
                                collector.stop();
                                msg.delete();
                                this.handleUseItem(client, message, id);
                            });
                        }
                    });
                });
            });
            client.models.userProfiles.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                if (type == 'XP') {
                    db.user_xp += this.items.find(x => x.id == id).reward[0].amount;
                }
                if (type == 'COIN') {
                    db.user_coins += this.items.find(x => x.id == id).reward[0].amount;
                }
                db.save((err) => new client.methods.log(client, message.guild).error(err));
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
                    if (err) return new client.methods.log(client, message.guild).error(err);
                    client.models.userProfiles.findOne({
                        "user_id": message.author.id
                    }, (err, db) => {
                        if (err) return new client.methods.log(client, message.guild).error(err);
                        if (type == 'XP') {
                            db.user_xp += rewards.find(x => x.id == reaction.emoji.name).reward;
                        }
                        if (type == 'COIN') {
                            db.user_coins += rewards.find(x => x.id == reaction.emoji.name).reward;
                        }
                        db.save((err) => {
                            if (err) return new client.methods.log(client, message.guild).error(err);
                        });
                    });
                    db.inventory.find(x => x.id == id).amount = db.inventory.find(x => x.id == id).amount - 1;
                    db.save((err) => {
                        if (err) return new client.methods.log(client, message.guild).error(err);
                        client.functions.inventoryCheckAmount(client, id, message.author.id);
                        message.channel.send(new client.modules.Discord.MessageEmbed()
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`> You opened a ${this.resolveToEmbedName(id)} and received: **${rewards.find(x => x.id == reaction.emoji.name).reward} ${type == 'COIN' ? (rewards.find(x => x.id == reaction.emoji.name).reward > 1 ? 'Coins' : 'Coin') : 'XP'}**
                        ${rewards.filter(x => x.id !== reaction.emoji.name).map(i => `${i.id} - ${i.reward} XP`).join(`\n`)}

                        You have ${db.inventory.find(x => x.id == id).amount} of this item left
                        ${db.inventory.find(x => x.id == id).amount > 0 ? `** **\n:white_check_mark: **Claim another ${this.resolveToEmbedName(id)}**` : ''}`)
                        ).then(msg => {
                            client.models.userInventories.findOne({
                                "user_id": message.author.id
                            }, (err, db) => {
                                if (err) return new client.methods.log(client).error(err);
                                if (!db.inventory.find(x => x.id == id)) return;
                                if (db.inventory.find(x => x.id == id).amount > 0) {
                                    msg.react(client.storage.emojiCharacters['white_check_mark']);
                                    let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id == message.author.id, {
                                        time: 120000
                                    });
                                    collector.on('collect', reaction => {
                                        collector.stop();
                                        msg.delete();
                                        this.handleUseItem(client, message, id);
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    }

    confirmUseItem(client, message, id) {
        return new Promise(async (resolve, reject) => {
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
