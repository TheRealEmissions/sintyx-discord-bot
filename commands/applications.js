module.exports = class app {
    constructor() {
        this.name = 'applications',
            this.alias = ["apps"],
            this.usage = '-applications [ID]',
            this.category = 'user',
            this.description = 'View a list of all of your applications or view a specific application\'s information.'
    }

    async run(client, message, args) {

    }
}
