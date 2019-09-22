module.exports = class suggestionreject {
    constructor() {
        this.name = 'suggestionreject',
            this.alias = ["suggestreject", "sr", "sd", "suggestiondeny", "suggestdeny", "sdeny", "sreject", "suggestd", "suggestiond"],
            this.usage = '-suggestionreject <ID>',
            this.category = 'administration',
            this.description = 'Reject a suggestion!'
    }

    denySuggestion(client, message, id, comment) {
        client.models.suggestionsData.findOne({
            "reference_id": id
        }, async (err, db) => {
            if (err) return new client.methods.log(client).error(err);
            const user = await client.users.fetch(db.user_id);
            const channel = await message.guild.channels.find(x => x.name == "suggestions");
            const msg = await channel.messages.fetch(db.message_id);
            msg.delete();
            message.guild.channels.find(x => x.name == "rejected").send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle(`Suggestion from **${user.tag}**:`)
                .setDescription(db.suggestion_desc)
                .addField(`Comment from **${message.author.tag}**:`, comment)
                .setTimestamp()
                .setThumbnail(user.avatarURL())
                .setFooter(id)
            );
            if (db.suggestion_info.length > 0) {
                db.suggestion_info[0].type = 'REJECTED';
                db.suggestion_info[0].timestamp = new Date();
                db.suggestion_info[0].comment = comment;
            } else db.suggestion_info.push({
                type: 'REJECTED',
                timestamp: new Date(),
                comment: comment
            });
            db.save((err) => new client.methods.log(client).error(err));
        });
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        if (!message.member.roles.get(message.guild.roles.find(x => x.name == "Management").id)) return;
        if (!args[1]) return;
        client.models.suggestionsData.findOne({
            "reference_id": args[1]
        }, (err, db) => {
            if (err) return new client.methods.log(client).error(err);
            if (!db) return message.channel.send(`The suggestion with the reference ID **${args[1]}** does not exist!`);
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(`> You are denying **${args[1]}** - what is your comment for this suggestion?
                ${db.suggestion_desc}`)
            ).then(msg => {
                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                collector.on('collect', async (comment) => {
                    msg.delete();
                    comment.delete();
                    collector.stop();
                    this.denySuggestion(client, message, args[1], comment);
                });
            });
        });
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
