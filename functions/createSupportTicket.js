let createSupportTicketFunction = function createSupportTicket(guild, author, member) {
    let random_string = require(`crypto-random-string`);
    guild.createChannel(`support-${author.username}-${random_string({length: 10, type: 'base64'})}`).then(async(channel) => {
        return;
    });
}

module.exports = createSupportTicketFunction;