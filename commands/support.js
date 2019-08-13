module.exports = class support {
    constructor() {
        this.name = 'support',
            this.alias = ["supportticket", "new"],
            this.usage = `-support [reason]`,
            this.category = 'tickets',
            this.description = 'Open a support ticket with an optional reason'
    }

    async run(client, message, args) {
        function run() {
            let startDate = new Date().getTime();
            let random_string = require(`crypto-random-string`);
            let randomString = random_string({
                length: 10,
                type: 'base64'
            });
            message.channel.send(`${client.storage.emojiCharacters['timer']} Creating your support ticket... please wait.`).then(startMsg => {
                message.guild.channels.create(`support-${message.author.username}-${randomString}`).then(async (channel) => {
                    let category = message.guild.channels.find(c => c.name == "Support Tickets" && c.type == "category");
                    if (!category) {
                        startMsg.edit(` `).then(() => startMsg.edit(new client.functions.errorEmbed(`Support Ticket`, `S001`, message.guild.member(client.user).displayHexColor)));
                        channel.delete();
                    } else {
                        channel.setParent(category);
                        let supportTicketManager = message.guild.roles.find(x => x.id == client.storage.roles['supportTicketManager']);
                        if (!supportTicketManager) {
                            startMsg.edit(` `).then(() => startMsg.edit(new client.functions.errorEmbed(`Support Ticket`, `S002`, message.guild.member(client.user).displayHexColor)));
                            channel.delete();
                        } else {
                            let reason = Boolean(args[1]) ? message.content.slice(args[0].length + 1) : `No reason provided`;
                            let newdb = new client.models.supportTickets({
                                user_id: message.author.id,
                                reference_id: randomString,
                                channel_id: channel.id,
                                channel_reason: reason
                            });
                            newdb.save((err) => new client.methods.log(client, message.guild).error(err));
                            client.models.userProfiles.findOne({
                                "user_id": message.author.id
                            }, (err, db) => {
                                if (err) return new client.methods.log(client, message.guild).error(err);
                                db.open_tickets.push({
                                    reference_id: randomString
                                });
                                db.ticket_history.push({
                                    reference_id: randomString,
                                    timestamp: new Date()
                                });
                                db.save((err) => new client.methods.log(client, message.guild).error(err));
                            })
                            channel.overwritePermissions({
                                permissionOverwrites: [{
                                        id: message.author.id,
                                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY'],
                                    },
                                    {
                                        id: message.guild.roles.find(x => x.name == "@everyone").id,
                                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                                    },
                                ],
                                reason: 'Needed to change permissions'
                            });
                            channel.send(`<@${message.author.id}> <@&${client.storage.roles['supportTicketManager']}>`).then(msg => {
                                setTimeout(() => {
                                    msg.delete();
                                }, 10)
                            });
                            let embed = new client.modules.Discord.MessageEmbed()
                                .setTitle(`**Support Ticket** opened by *${message.author.tag}*`)
                                .setColor(message.guild.member(client.user).displayHexColor)
                                .setDescription(`Welcome to your Support Ticket. Please leave your issue in full detail and one of our staff members will assist you as soon as possible, thank you for your patience.`)
                                .addField(`Reference ID:`, randomString, true)
                                .addField(`Reason/Issue:`, "```" + reason + "```", true)
                            channel.send(embed).then(msg => msg.pin());
                            let endDate = parseInt((new Date().getTime()) - startDate);
                            let embed2 = new client.modules.Discord.MessageEmbed()
                                .setTitle(`**Support Ticket**`)
                                .setColor(message.guild.member(client.user).displayHexColor)
                                .setDescription(`${client.storage.emojiCharacters['white_check_mark']} Created your support ticket! ${channel}`)
                                .setFooter(`Processed in ${endDate}ms`)
                            startMsg.edit(` `).then(() => startMsg.edit(embed2));
                        }
                    }
                });
            });
        }

        client.models.userProfiles.findOne({
            "user_id": message.author.id
        }, (err, db) => {
            if (err) return new client.methods.log(client, message.guild).error(err);
            if (!db.open_tickets) {
                db.open_tickets = [];
                db.save((err) => new client.methods.log(client, message.guild).error(err));
            } else {
                if (db.open_tickets.length === 5) {
                    return message.channel.send(`You have too many open tickets! Try closing some before continuing.`);
                } else {
                    run();
                }
            }
        });

    }
}