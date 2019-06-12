module.exports = class ticket {
    constructor() {
        this.name = 'ticket',
        this.alias = [],
        this.usage = '-ticket [options]',
        this.category = 'administration',
        this.description = 'Retrieve information, edit or delete a Support Ticket'
    }

    async run(client, message, args) {
        /*

        -ticket info <ID>
        > sends static information
        > formats logs into a file
        > saves file
        > sends file along with information
        > deletes file



        */
    }
}