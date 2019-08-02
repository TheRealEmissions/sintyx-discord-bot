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
                if (err) return console.error(err);
                let items = require(`../storage`).inventoryItems,
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
                    db.save((err) => console.error(err));
                }
            });
        }
    }
}