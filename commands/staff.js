class profile {

}

module.exports = class staff {
    constructor() {
        this.name = 'staff',
            this.alias = [],
            this.usage = '-staff <options>',
            this.category = 'administration',
            this.description = 'Run staff based commands such as profile viewing'
    }

    async run(client, message, args) {

    }
}
