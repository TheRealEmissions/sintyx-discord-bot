module.exports = function inventoryCheckAmount(client, id, userid) {
    new client.methods.log(client).debug(`Function ran: inventoryCheckAmount.js`);
    client.models.userInventories.findOne({
        "user_id": userid
    }, (err, db) => {
        if (err) return console.error(err);
        if (db.inventory.find(x => x.id == id).amount == 0) {
            client.models.userInventories.update({
                "user_id": userid
            }, {
                "$pull": {
                    "inventory": {
                        "id": id
                    }
                }
            }, {
                safe: true,
                multi: false
            }, (err, obj) => {
                if (err) return console.error(err);
            });
        }
    })
}
