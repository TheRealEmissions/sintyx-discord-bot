module.expots = class remove {
    constructor() {
        this.name = 'remove',
        this.alias = [],
        this.usage = 'remove <@user> [reason]',
        this.category = 'tickets',
        this.description = 'Remove a user from a Support Ticket'
    }

    async run(client, message, args) {
        client.models.supportTickets.findOne({
            "channel_id": message.channel.id
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return message.channel.send(`:x: You can only remove users from Support Tickets!`).then(msg => {
                    setTimeout(() => {
                        msg.delete();
                        message.delete();
                    }, 5000);
                });
            }
            if (!args[1]) return;
            let user = message.mentions.users.first() ? message.mentions.users.first() : message.guild.members.get(`${args[1]}`);
            if (!user) return message.channel.send(`:x: The user you have attempted to remove from this ticket does not exist in this guild.`).then(msg => {
                setTimeout(() => {
                    msg.delete();
                    message.delete();
                }, 5000);
            });
            if (message.channel.permissionOverwrites.get(user.id)) {
                message.channel.updateOverwrites(user, {
                    VIEW_CHANNEL: false,
                    SEND_MESSAGES: false,
                    EMBED_LINKS: false,
                    ATTACH_FILES: false,
                    READ_MESSAGE_HISTORY: false
                });
                message.channel.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setDescription(`Removed <@${user.id}> from <#${message.channel.id}>!`)
                    .addField(`Reason:`, "```" + args[2] ? message.content.slice(args[0].length + args[1].length + 2) : 'No reason provided' + "```")
                    .setThumbnail(user.avatarURL())
                );
            } else return message.channel.send(`:x: You cannot remove a user that has not been added to this Support Ticket!`).then(msg => {
                setTimeout(() => {
                    msg.delete();
                    message.delete();
                }, 5000);
            });
        })
    }
}