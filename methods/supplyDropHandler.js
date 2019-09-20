class supply {
    constructor(client) {
        this.client = client;
    }

    getChannel(id) {
        return new Promise(async (resolve, reject) => {
            let channel;
            if (id == null) channel = this.client.storage.messageCache['supplyDropChannel'].id;
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
            let type = types[this.client.functions.genNumberBetween(1, 3)];
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

            } else {

            }
        });
    }
}
