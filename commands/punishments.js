module.exports = class punishments {
    constructor() {
        this.name = 'punishments',
        this.usage = '-punishments [id]',
        this.alias = ['punishment', 'bans', 'mutes', 'kicks']
        this.category = 'user',
        this.description = 'View your punishments list and the details behind the punishment'
    }

    async run(client, message, args) {
        // run
    }
}