module.exports = class suggestionaccept {
    constructor() {
        this.name = 'suggestionaccept',
        this.alias = ['suggestaccept', 'sa', 'suggesta', 'suggestiona', 'saccept'],
        this.usage = '-suggestionaccept <ID>',
        this.category = 'administration',
        this.description = 'Accept a suggestion!'
    }

    async run(client, message, args) {
        if (!message.member.roles.get(message.guild.roles.find(x => x.name == "Management").id)) return;
    }
}