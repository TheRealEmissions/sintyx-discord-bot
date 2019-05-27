module.exports = class close {
    constructor() {
        this.name = 'close',
            this.alias = [],
            this.usage = `-close`
    }

    async run(client, message, args) {

        if (message.channel.parent.name !== "Support Tickets") {
            return;
        } else {
            let reason = Boolean(message.content.slice(args[0].length + 1)) ? message.content.slice(args[0].length + 1) : `No reason provided`;
            let confirmClose = new client.modules.Discord.MessageEmbed()
                .setDescription(`**Are you sure you want to close this ticket?** If so, please confirm below.`)
                .addField("Reason", "```" + reason + "```")
                .setColor(message.guild.member(client.user).displayHexColor)
            message.channel.send(confirmClose).then(async(msg) => {
                await msg.react(client.storage.emojiCharacters['white_check_mark']);
                let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id == message.author.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', async(reaction) => {
                    collector.stop();
                    let confirmed = new client.modules.Discord.MessageEmbed()
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