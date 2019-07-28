module.exports = class add {
    constructor() {
        this.name = 'add',
        this.alias = [],
        this.usage = '-add <@user> [reason]',
        this.category = 'tickets',
        this.description = 'Add a user to a Support Ticket'
    }

    async run(client, message, args) {
        client.models.supportTickets.findOne({
            "channel_id": message.channel.id
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return message.channel.send(`:x: You can only add users to Support Tickets!`).then(msg => {
                    setTimeout(() => {
                        msg.delete();
                        message.delete();
                    }, 5000);
                });
            }
            if (!args[1]) return;
            let user = message.mentions.users.first() ? message.mentions.users.first() : message.guild.members.get(`${args[1]}`);
            if (!user) return message.channel.send(`:x: The user you have attempted to add to this ticket does not exist in this guild.`).then(msg => {
                setTimeout(() => {
                    msg.delete();
                    message.delete();
                }, 5000);
            });
            message.channel.overwritePermissions({
                permissionOverwrites: [{
                    id: user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY'],
                }], reason: 'Needed to change permissions'
            });
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`Added <@${user.id}> to <#${message.channel.id}>!`)
                .addField(`Reason:`, "```" + args[2] ? message.content.slice(args[0].length + args[1].length + 2) : 'No reason provided')
                .setThumbnail(user.avatarURL())
            );
        });
    }
}