module.exports = class errorcode {
    constructor() {
        this.name = 'errorcode',
            this.alias = ["error", "errcode"],
            this.usage = `-errorcode`
    }

    async run(client, message, args) {
        let ec = client.storage.errorCodes;
        if (!ec[`${args[1].toString()}`]) {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Error Codes** - ${args[1].toString()}`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`Unfortunately, we could not find the Error Code ` + "`" + args[1].toString() + "`" + `. Please make sure your Error Code is exactly as written.`)
            message.channel.send(embed);
        } else {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Error Codes** - ${args[1].toString()}`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(ec[`${args[1].toString()}`])
            message.channel.send(embed);
        }
    }
}
