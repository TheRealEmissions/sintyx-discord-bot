module.exports = class example {
    constructor() {
        this.name = 'example',
            this.alias = [],
            this.usage = `=example`
    }

    async run(client, message, args) {
        message.channel.send(`true`);
        const dbInfo = new client.dbModels.exampleTest({
            userID: message.author.id,
            timeRan: message.createdAt
        });
        client.functions.dbSave(dbInfo);
    }
}