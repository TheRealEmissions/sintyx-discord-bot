module.exports = class settings {
    constructor() {
        this.name = 'settings',
            this.alias = [],
            this.usage = '-settings',
            this.category = 'user',
            this.description = 'Edit your personal settings'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        client.models.userSettings.findOne({
            "user_id": message.author.id
        }, (err, db) => {
            if (err) return new client.methods.log(client, message.guild).error(err);
            if (!db) return;
            let ec = client.storage.emojiCharacters;

            function createSettingsEmbed(xp, coin, tm) {
                return new client.modules.Discord.MessageEmbed()
                    .setTitle(`Settings for **${message.author.tag}**:`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .addField(`Setting`, `${ec[1]} XP Ping\n${ec[2]} Coin Ping\n${ec[3]} Ticket Mentioning`, true)
                    .addField(`Status`, `${xp == true ? ec['white_check_mark'] : ec['x']}\n${coin == true ? ec['white_check_mark'] : ec['x']}\n${tm == true ? ec['white_check_mark'] : ec['x']}`, true)
            }

            message.channel.send(createSettingsEmbed(db.options.find(x => x.name == "xp_ping").boolean, db.options.find(x => x.name == "coin_ping").boolean, db.options.find(x => x.name == "ticket_mentioning").boolean)).then(msg => {
                msg.react(ec[1]).then(() => msg.react(ec[2]).then(() => msg.react(ec[3]).then(() => msg.react(ec['x']))));
                let filter = (reaction, user) => ((reaction.emoji.name == ec[1]) || (reaction.emoji.name == ec[2]) || (reaction.emoji.name == ec[3]) || (reaction.emoji.name == ec['x'])) && user.id == message.author.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});

                function editSettingsEmbed() {
                    client.models.userSettings.findOne({
                        "user_id": message.author.id
                    }, (err, db) => {
                        if (err) return new client.methods.log(client, message.guild).error(err);
                        msg.edit(createSettingsEmbed(db.options.find(x => x.name == "xp_ping").boolean, db.options.find(x => x.name == "coin_ping").boolean, db.options.find(x => x.name == "ticket_mentioning").boolean));
                    });
                }

                function switchBoolean(entry) {
                    if (entry == true) {
                        return false;
                    } else {
                        return true;
                    }
                }
                collector.on('collect', reaction => {
                    if (reaction.emoji.name == ec[1]) {
                        reaction.users.remove(reaction.users.last());
                        db.options.find(x => x.name == "xp_ping").boolean = switchBoolean(db.options.find(x => x.name == "xp_ping").boolean);
                        db.save((err) => {
                            if (err) return new client.methods.log(client, message.guild).error(err);
                            if (!err) editSettingsEmbed();
                        });
                    }
                    if (reaction.emoji.name == ec[2]) {
                        reaction.users.remove(reaction.users.last());
                        db.options.find(x => x.name == "coin_ping").boolean = switchBoolean(db.options.find(x => x.name == "coin_ping").boolean);
                        db.save((err) => {
                            if (err) return new client.methods.log(client, message.guild).error(err);
                            if (!err) editSettingsEmbed();
                        });
                    }
                    if (reaction.emoji.name == ec[3]) {
                        reaction.users.remove(reaction.users.last());
                        db.options.find(x => x.name == "ticket_mentioning").boolean = switchBoolean(db.options.find(x => x.name == "ticket_mentioning").boolean);
                        db.save((err) => {
                            if (err) return new client.methods.log(client, message.guild).error(err);
                            if (!err) editSettingsEmbed();
                        });
                    }
                    if (reaction.emoji.name == ec['x']) {
                        collector.stop();
                        message.delete();
                        msg.delete();
                    }
                });
            });


        })
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
