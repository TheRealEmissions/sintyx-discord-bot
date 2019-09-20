module.exports = class close {
    constructor() {
        this.name = 'close',
            this.alias = ["delete", "cl"],
            this.usage = `-close [reason]`,
            this.category = 'tickets',
            this.description = 'Close a support ticket with an optional reason'
    }

    closeProcess(client, message, args, type = '') {
        return new Promise((resolve, reject) => {
            let reason = message.content.slice(args[0].length + 1) ? message.content.slice(args[0].length + 1) : 'No reason provided';
            let confirmClose = new client.modules.Discord.MessageEmbed()
                .setTitle(`**${type}** - Closing`)
                .setDescription(`**Are you sure you want to close this ticket?** If so, please confirm below.`)
                .addField(`Reason:`, `\`\`\`${reason}\`\`\``)
                .setColor(message.guild.me.displayHexColor)
            message.channel.send(confirmClose).then(async msg => {
                await msg.react(client.storage.emojiCharacters['white_check_mark']);
                let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id == message.author.id, {});
                collector.on('collect', reaction => {
                    collector.stop();
                    return resolve({
                        msg: msg,
                        reason: reason
                    });
                });
            });
        });
    }

    editCloseMessage(msg, reason, type) {
        let confirmed = {
            embed: {
                color: msg.guild.me.displayHexColor,
                timestamp: new Date(),
                title: `**${type}** - Closing`,
                fields: [{
                    name: 'Reason:',
                    value: `\`\`\`${reason}\`\`\``
                }],
                description: type == 'Support Ticket' ? `Thank you for seeking support and opening this ticket. We hope the issue you had has been resolved. If not, please be sure to open another ticket!` : (type == 'Application' ? `Thank you for opening this application ticket! Whether you were accepted or denied, we appreciate your effort!` : null)
            }
        }
        msg.edit(confirmed);
    }

    async supportTicket(client, message, args) {
        const {
            msg,
            reason
        } = await this.closeProcess(client, message, args, 'Support Ticket');
        client.models.supportTickets.findOne({
            "channel_id": message.channel.id
        }, (err, db) => {
            if (err) return new client.methods.log(client, message.guild).error(err);
            db.closure_id = message.author.id;
            db.closure_reason = reason;
            db.save((err) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
            });
            //
            client.models.userProfiles.findOne({
                "user_id": db.user_id
            }, (err, datab) => {
                if (err) return new client.methods.og(client, message.guild).error(err);
                if (!datab.open_tickets) return;
                if (!datab.open_tickets.find(x => x.reference_id == db.reference_id)) return;
                client.models.userProfiles.findOneAndUpdate({
                    "user_id": db.user_id
                }, {
                    $pull: {
                        "open_tickets": {
                            "reference_id": db.reference_id
                        }
                    }
                }, (err, model) => {
                    if (err) return new client.methods.log(client, message.guild).error(err);
                });
            });
        });
        this.editCloseMessage(msg, reason, 'Support Ticket');
        setTimeout(() => {
            message.channel.delete();
            client.models.supportTickets.findOne({
                "channel_id": message.channel.id
            }, async (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                let user = await client.users.fetch(db.user_id);
                user.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.me.displayHexColor)
                    .setTitle(`Your Support Ticket was closed!`)
                    .setDescription(`Reference ID: ${db.reference_id}`)
                );
                client.modules.fs.appendFileSync(`./commands/${db.channel_id}.json`, JSON.stringify(db.logs));
                user.send({
                    files: [`./commands/${db.channel_id}.json`]
                }).then(() => {
                    client.modules.fs.unlink(`./commands/${db.channel_id}.json`, (err) => new client.methods.log(client).error(err));
                })
            });
        }, 10000);
    }

    async app(client, message, args) {
        const {
            msg,
            reason
        } = await this.closeProcess(client, message, args, 'Application');
        this.editCloseMessage(msg, reason, 'Application');
        setTimeout(() => {
            message.channel.delete();
        }, 10000);
    }

    async run(client, message, args) {
        if (message.channel.parent.name == "Support Tickets") {
            this.supportTicket(client, message, args);
        }
        if (message.channel.parent.name == "Applications") {
            this.app(client, message, args);
        }
    }
}
