module.exports = class ticket {
    constructor() {
        this.name = 'ticket',
            this.alias = [],
            this.usage = '-ticket [options: info]',
            this.category = 'administration',
            this.description = 'Retrieve information, edit or delete a Support Ticket'
    }

    async run(client, message, args) {
        /*

        -ticket info <ID>
        > sends static information
        > formats logs into a file
        > saves file
        > sends file along with information
        > deletes file



        */
        if (!args[2]) return;
        client.models.supportTickets.findOne({
            "reference_id": args[2]
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return message.channel.send(`The reference ID you have provided does not match a support ticket.`);
            }
            if ((message.member.roles.find(x => x.name == "Owner")) || (db.user_id == message.author.id)) {
                let embed;
                client.modules.fs.appendFileSync(`./commands/${db.channel_id}.json`, JSON.stringify(db.logs));
                if (db.closure_id == null) {
                    embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`Ticket Information - **${args[2]}**`)
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .addField(`Opened by:`, `<@${message.guild.members.find(x => x.id == db.user_id).id}>`, true)
                        .addField(`Reason for opening:`, "```" + db.channel_reason + "```", true)
                } else {
                    embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`Ticket Information - **${args[2]}**`)
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .addField(`Opened by:`, `<@${message.guild.members.find(x => x.id == db.user_id).id}>`, true)
                        .addField(`Reason for opening:`, "```" + db.channel_reason + "```", true)
                        .addField(`Closed by:`, `<@${message.guild.members.find(x => x.id == db.closure_id).id}>`, true)
                        .addField(`Closure reason:`, "```" + db.closure_reason + "```", true)
                }
                message.channel.send(embed);
                message.channel.send({
                    files: [`./commands/${db.channel_id}.json`]
                }).then(() => {
                    client.modules.fs.unlink(`./commands/${db.channel_id}.json`, (err) => console.error(err));
                });
            } else {
                return message.channel.send(`You do not have permission to view the information for this ticket.`);
            }
        });
    }
}