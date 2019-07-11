module.exports = class purge {
    constructor() {
        this.name = 'purge',
        this.alias = [],
        this.usage = '-purge <number>',
        this.category = 'administration',
        this.description = 'Delete a number of messages from a channel (limit 100)'
    }

    async run(client, message, args) {
        if (message.member.roles.find(x => x.name == "Owner")) {
            if (args[1] <= 100) {
                message.channel.bulkDelete(args[1]).then(messages => {
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .setDescription(`Deleted ${messages.size} messages from ${message.channel}`)
                    message.channel.send(embed);
                });
            }
        }
    }
}