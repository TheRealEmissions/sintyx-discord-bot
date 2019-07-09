module.exports = class settings {
    constructor() {
        this.name = 'settings',
            this.alias = [],
            this.usage = '-settings',
            this.category = 'user',
            this.description = 'Edit your personal settings'
    }

    async run(client, message, args) {
        client.models.userSettings.findOne({
            "user_id": message.author.id
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) return;
            let ec = client.storage.emojiCharacters;

            function createSettingsEmbed(xp, coin) {
                return new client.modules.Discord.MessageEmbed()
                    .setTitle(`Settings for **${message.author.tag}**:`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .addField(`Reaction`, `${ec[1]}\n${ec[2]}`, true)
                    .addField(`Setting`, `XP Ping\nCoin Ping`, true)
                    .addField(`Status`, `${xp == true ? ec['white_check_mark'] : ec['x']}\n${coin == true ? ec['white_check_mark'] : ec['x']}`, true)
            }

            message.channel.send(createSettingsEmbed(db.options.find(x => x.name == "xp_ping").boolean, db.options.find(x => x.name == "coin_ping").boolean)).then(msg => {
                msg.react(ec[1]).then(() => msg.react(ec[2]).then(() => msg.react(ec['x'])));
                let filter = (reaction, user) => ((reaction.emoji.name == ec[1]) || (reaction.emoji.name == ec[2]) || (reaction.emoji.name == ec['x'])) && user.id == message.author.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});

                function editSettingsEmbed() {
                    client.models.userSettings.findOne({
                        "user_id": message.author.id
                    }, (err, db) => {
                        if (err) return console.error(err);
                        msg.edit(createSettingsEmbed(db.options.find(x => x.name == "xp_ping").boolean, db.options.find(x => x.name == "coin_ping").boolean));
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
                            if (err) return console.error(err);
                            if (!err) editSettingsEmbed();
                        });
                    }
                    if (reaction.emoji.name == ec[2]) {
                        reaction.users.remove(reaction.users.last());
                        db.options.find(x => x.name == "coin_ping").boolean = switchBoolean(db.options.find(x => x.name == "coin_ping").boolean);
                        db.save((err) => {
                            if (err) return console.error(err);
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
    }
}