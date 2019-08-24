module.exports = class suggestionaccept {
    constructor() {
        this.name = 'suggestionaccept',
            this.alias = ['suggestaccept', 'sa', 'suggesta', 'suggestiona', 'saccept'],
            this.usage = '-suggestionaccept <ID>',
            this.category = 'administration',
            this.description = 'Accept a suggestion!'
    }

    async run(client, message, args) {
        if (!message.member.roles.get(message.guild.roles.find(x => x.name == "Management").id)) return;
        if (!args[1]) return;
        client.models.suggestionsData.findOne({
            "reference_id": args[1]
        }, (err, db) => {
            if (err) return new client.methods.log(client, message.guild).error(err);
            if (!db) return message.channel.send(`The suggestion with the reference ID **${args[1]}** does not exist!`);
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`> You are accepting **${args[1]}** - what is your comment for this suggestion?
                ${db.suggestion_desc}`)
            ).then(msg => {
                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                collector.on('collect', async (comment) => {
                    msg.delete();
                    comment.delete();
                    collector.stop();
                    this.acceptSuggestion(client, message, args[1], comment);
                });
            });
        })
    }

    acceptSuggestion(client, message, id, comment) {
        client.models.suggestionsData.findOne({
            "reference_id": id
        }, async (err, db) => {
            if (err) return new client.methods.log(client, message.guild).error(err);
            let user = await client.users.fetch(db.user_id);
            let channel = await message.guild.channels.find(x => x.name == "suggestions");
            let msg = await channel.messages.fetch(db.message_id).catch(err => new client.methods.log(client, message.guild).error(err));
            msg.delete();
            message.guild.channels.find(x => x.name == "accepted").send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setTitle(`Suggestion from **${user.tag}**:`)
                .setDescription(db.suggestion_desc)
                .addField(`Comment from **${message.author.tag}**:`, comment)
                .setTimestamp()
                .setThumbnail(user.avatarURL())
                .setFooter(id)
            );
            if (db.suggestion_info.length > 0) {
                db.suggestion_info[0].type = 'ACCEPTED';
                db.suggestion_info[0].timestamp = new Date();
                db.suggestion_info[0].comment = comment;
            } else db.suggestion_info.push({
                type: 'ACCEPTED',
                timestamp: new Date(),
                comment: comment
            });
            db.save((err) => new client.methods.log(client, message.guild).error(err));
        })
    }
}
