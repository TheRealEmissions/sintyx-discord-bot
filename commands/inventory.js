module.exports = class inventory {
    constructor() {
        this.name = 'inventory',
        this.alias = ["inv"],
        this.usage = '-inventory',
        this.category = 'user',
        this.description = 'Manage your inventory'
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

    */

    resolveToName(id) {
        let items = [
            'VIP Role',                 // 1
            'XP Pouch - 10 XP',         // 2
            'XP Pouch - 50 XP',         // 3
            'XP Pouch - 100 XP',        // 4
            'XP Pouch - 250 XP',        // 5
            'XP Pouch - 500 XP',        // 6
            'XP Pouch - 1000 XP',       // 7
            'XP Pouch - 2000 XP',       // 8
            'XP Crate - 10-50 XP',      // 9
            'XP Crate - 50-100 XP',     // 10
            'XP Crate - 100-250 XP',    // 11
            'XP Crate - 250-500 XP',    // 12
            'XP Crate - 500-1000 XP',   // 13
            'XP Crate - 1000-2000 XP',  // 14
            'XP Crate - 10-2000 XP',    // 15
            'Coin Pouch - 1 Coin',      // 16
            'Coin Pouch - 2 Coins',     // 17
            'Coin Pouch - 5 Coins',     // 18
            'Coin Pouch - 10 Coins',    // 19
            'Coin Pouch - 25 Coins',    // 20
            'Coin Pouch - 50 Coins',    // 21
            'Coin Pouch - 100 Coins',   // 22
            'Coin Pouch - 200 Coins',   // 23
            'Coin Pouch - 500 Coins',   // 24
            'Coin Pouch - 1000 Coins'   // 25
        ]
        return items[id];
    }

    resolveToDesc(id) {
        let items = [
            'A role that gains you acess to the VIP Hub along with access to name colour customisation etc.',
            'A claimable pouch that gives you 10 XP',
            'A claimable pouch that gives you 50 XP',
            'A claimable pouch that gives you 100 XP',
            'A claimable pouch that gives you 250 XP',
            'A claimable pouch that gives you 500 XP',
            'A claimable pouch that gives you 1000 XP',
            'A claimable pouch that gives you 2000 XP',
            'A crate that when opened gives you a random amount of XP between 10 and 50',
            'A crate that when opened gives you a random amount of XP between 50 and 100',
            'A crate that when opened gives you a random amount of XP between 100 and 250',
            'A crate that when opened gives you a random amount of XP between 250 and 500',
            'A crate that when opened gives you a random amount of XP between 500 and 1000',
            'A crate that when opened gives you a random amount of XP between 1000 and 2000',
            'A crate that when opened gives you a random amount of XP between 10 and 2000',
            'A claimable pouch that gives you 1 Coin',
            'A claimable pouch that gives you 2 Coins',
            'A claimable pouch that gives you 5 Coins',
            'A claimable pouch that gives you 10 Coins',
            'A claimable pouch that gives you 25 Coins',
            'A claimable pouch that gives you 50 Coins',
            'A claimable pouch that gives you 100 Coins',
            'A claimable pouch that gives you 200 Coins',
            'A claimable pouch that gives you 500 Coins',
            'A claimable pouch that gives you 1000 Coins'
        ]
        return items[id];
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
            }, 5000));
            let inv = db.inventory,
                i = 0,
                items = []
            for (let count in inv) {
                if (i >= inv.length) {
                    let embed = {
                        embed: {
                            color: message.guild.member(client.user).displayHexColor,
                            title: `${message.author.username}${message.author.username.endsWith('s') ? `'` : `'s`} Inventory:`,
                            description: `** ** \n:one: Use item\n:two: Send an item to another user\n:three: Delete an item\n** **`,
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
        /*
        client.models.userInventories.find({
            "user_id": message.author.id
        }.lean().exec((err, docs) => {
            if (err) return console.error(err);
            docs = docs[0];
            if (!docs) {
                let newdb = new client.models.userInventories({
                    user_id: message.author.id,
                    inventory: []
                });
                newdb.save((err) => console.error(err));
                return message.channel.send("We found that you did not have an inventory... so we created you one. Please run the command again.")
            }
            if (docs.inventory.length < 1) return message.channel.send(new client.modules.Discord.MessageEmbed().setDescription(`Your inventory is currently empty.`).setColor(message.guild.member(client.user).displayHexColor)).then(msg => setTimeout(() => {
                msg.delete();
                message.delete();
            }, 5000));
            let inv = docs.inventory,
                i = 0,
                items = []
            for (let count in inv) {
                if (i >= inv.length) {
                    let embed = {
                        embed: {
                            color: message.guild.member(client.user).displayHexColor,
                            title: `${message.author.username}${message.author.username.endsWith('s') ? `'` : `'s`} Inventory:`,
                            description: `** ** \n:one: Use item\n:two: Send an item to another user\n:three: Delete an item\n** **`,
                            fields: []
                        }
                    }
                    embed.embed.fields.push({
                        name: `Item:`,
                        value: items.map(i => `[${i.name}](https://sintyx.com/ "${i.desc}")`).join(`\n`),
                        inline: true
                    }, {
                        name: `Amount:`,
                        value: items.map(i => `${i.amount}`).join(`\n`),
                        inline: true
                    });
                    message.channel.send(embed).then(msg => {
                        this.initInventory(client, message, args, msg, docs, items);
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
        }));*/
    }

    initInventory(client, message, args, msg, db, items) {

    }
}