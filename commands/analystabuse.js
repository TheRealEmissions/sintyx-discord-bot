module.exports = class analystabuse {
    constructor() {
        this.name = 'analystabuse',
        this.alias = [],
        this.usage = '-analystabuse',
        this.category = 'administration',
        this.description = 'An abusive command that gives a shit load of inventory items'
    }

    async run(client, message, args) {
        if (message.member.roles.find(x => x.name == 'Analysts')) {
            client.models.userInventories.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                let storage = require(`../storage`).inventoryItems;
                let items = [storage[0], storage[1], storage[6], storage[11], storage[21], storage[29], storage[35]];
                    i = 0;
                for (let count in items) {
                    if (i >= items.length) {
                        end();
                        break;
                    }
                    if (db.inventory.find(x => x.id == items[count].id)) {
                        db.inventory.find(x => x.id == items[count].id).amount += 100;
                    } else {
                        db.inventory.push({
                            id: items[count].id,
                            amount: 100
                        });
                    }
                    i++;
                }
                function end() {
                    db.save((err) => new client.methods.log(client, message.guild).error(err));
                }
            });
        }
    }
}