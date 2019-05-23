let createSupportTicketFunction = function createSupportTicket(guild, author, member, channel, client) {
    let random_string = require(`crypto-random-string`);
    guild.createChannel(`support-${author.username}-${random_string({length: 10, type: 'base64'})}`).then(async(channel) => {
        let category = guild.channels.find(c => c.name == "Support Tickets" && c.type == "category");
        if (!category) {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Support Ticket** - Error`)
                .setColor(guild.member(client.user).displayHexColor)
                .setDescription(`**Hey!** Unfortunately, we could not create your support ticket! Please display this error code to a member of staff.`)
                .addField(`Error Code`, `s001`)
                .setTimestamp();
            channel.send(embed);
        } else {
            return;
        }
    });
}

module.exports = createSupportTicketFunction;