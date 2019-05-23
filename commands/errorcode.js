module.exports = class errorcode {
    constructor() {
        this.name = 'errorcode',
            this.alias = ["error", "errcode"],
            this.usage = `-errorcode`
    }

    async run(client, message, args) {
        let ec = client.storage.errorCodes;
    }
}
