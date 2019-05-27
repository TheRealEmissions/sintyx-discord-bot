module.exports = class support {
    constructor() {
        this.name = 'support',
            this.alias = ["supportticket"],
            this.usage = `-support`
    }

    async run(client, message, args) {
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
                    startMsg.edit(` `).then(() => startMsg.edit(client.functions.errorEmbed(`Support Ticket`, `S001`, message.guild.member(client.user).displayHexColor)));
                    channel.delete();
                } else {
                    channel.setParent(category);
                    let supportTicketManager = message.guild.roles.find(x => x.id == client.storage.roles['supportTicketManager']);
                    if (!supportTicketManager) {
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**Support Ticket** - Error`)
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`**Hey!** Unfortunately, we could not create your support ticket! Please display this error code to a member of staff.`)
                            .addField(`Error Code`, `S002`)
                            .setTimestamp();
                        startMsg.edit(` `).then(() => startMsg.edit(embed));
                        channel.delete();
                    } else {
                        channel.send(`<@${message.author.id}> <@&${client.storage.roles['supportTicketManager']}>`).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 10)
                        });
                        let reason = Boolean(args[1]) ? message.content.slice(args[0].length + 1) : `No reason provided`;
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**Support Ticket**`)
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`Welcome to your Support Ticket. Please leave your issue in full detail and one of our staff members will assist you as soon as possible, thank you for your patience.`)
                            .addField(`Reference ID:`, randomString, true)
                            .addField(`Reason/Issue:`, "```" + reason + "```", true)
                        channel.send(embed);
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
}