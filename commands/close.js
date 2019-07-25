module.exports = class close {
    constructor() {
        this.name = 'close',
        this.alias = ["delete", "cl"],
        this.usage = `-close [reason]`,
        this.category = 'tickets',
        this.description = 'Close a support ticket with an optional reason'
    }

    async run(client, message, args) {

        if (message.channel.parent.name !== "Support Tickets") {
            return;
        } else {
            let reason = Boolean(message.content.slice(args[0].length + 1)) ? message.content.slice(args[0].length + 1) : `No reason provided`;
            let confirmClose = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Support Ticket** - Closing`)
                .setDescription(`**Are you sure you want to close this ticket?** If so, please confirm below.`)
                .addField("Reason", "```" + reason + "```")
                .setColor(message.guild.member(client.user).displayHexColor)
            message.channel.send(confirmClose).then(async (msg) => {
                await msg.react(client.storage.emojiCharacters['white_check_mark']);
                let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id == message.author.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', async (reaction) => {
                    collector.stop();
                    client.models.supportTickets.findOne({
                        "channel_id": message.channel.id
                    }, (err, db) => {
                        if (err) return console.error(err);
                        db.closure_id = message.author.id;
                        db.closure_reason = reason;
                        db.save((err) => console.error(err));
                        client.models.userProfiles.findOne({
                            "user_id": db.user_id
                        }, (err, datab) => {
                            if (err) return console.error(err);
                            if ((!datab.open_tickets) || (!datab.open_tickets.find(x => x.reference_id == db.reference_id))) {
                                return;
                            } else if (datab.open_tickets.find(x => x.reference_id == db.reference_id)) {
                                client.models.userProfiles.findOneAndUpdate({
                                    "user_id": db.user_id
                                }, {
                                    $pull: {
                                        "open_tickets": {
                                            "reference_id": db.reference_id
                                        }
                                    }
                                }, (err, model) => {
                                    if (err) return console.error(err);
                                });
                            }
                        })
                    })
                    let confirmed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**Support Ticket** - Closing`)
                        .setDescription(`Thank you for seeking support and opening this ticket. We hope the issue you had has been resolved. If not, please be sure to open another ticket!`)
                        .addField("Reason", "```" + reason + "```")
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .setTimestamp();
                    msg.edit(confirmed);
                    setTimeout(() => {
                        message.channel.delete();
                    }, 10000);
                });
            });
        }
    }
}