module.exports = class test {
    constructor() {
        this.name = 'test',
            this.alias = [],
            this.usage = `-test`
    }

    async run(client, message, args) {
        if (message.author.id == "201095756784992256") {
            message.channel.send(`${client.storage.emojiCharacters['white_check_mark']}`)
        } else {
            return;
        }
    }
}