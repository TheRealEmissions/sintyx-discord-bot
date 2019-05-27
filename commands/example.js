module.exports = class example {
    constructor() {
        this.name = 'example',
            this.alias = [],
            this.usage = `=example`
    }

    async run(client, message, args) {
        message.channel.send(`${client.storage.emojiCharacters['white_check_mark']}`)
    }
}