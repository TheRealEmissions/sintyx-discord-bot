module.exports = class ticket {
    constructor() {
        this.name = 'ticket',
        this.alias = [],
        this.usage = '-ticket [options]',
        this.category = 'administration',
        this.description = 'Retrieve information, edit or delete a Support Ticket'
    }

    async run(client, message, args) {
        
    }
}