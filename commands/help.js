module.exports = class help {
    constructor() {
        this.name = 'help',
            this.alias = ["guide", "helpme", "h"],
            this.usage = `-help`
    }

    async run(client, message, args) {
        if (!args[1]) {
            message.channel.send(`:mailbox_with_mail: I have sent you the help menu in your DMs!`)
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Help Menu**`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`To view a detailed description for any given command, please type: ` + "`" + `-help <command>` + "`")
                .addField(`-help`, `Display this menu in your chosen environment`, true)
                .addField(`-stats`, `View the statistics regarding the bot and the server!`, true)
            message.author.send(embed);
        } else
        if (args[1].toString() == "help") {
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setTitle(`**Help Menu** - Help`)
                .setDescription(`This command relays to the user all the available commands a user has access to. It can be used to find out what the functions of commands are and how they act and respond to a user running them.`)
                .addField(`Example use:`, `-help\n-help help\n-help stats`, true)
                .addField(`Aliases:`, `-guide\n-helpme\n-h`, true)
            message.channel.send(embed);
        } else
        if (args[1].toString() == "stats") {
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setTitle(`**Help Menu** - Stats`)
                .setDescription(`This command displays all the information regarding the bot and the server. It can be useful to run this command if you believe the bot or the server is running slow.`)
                .addField(`Example use:`, `-stats`, true)
                .addField(`Aliases:`, `-statistics\n-info\n-botinfo\n-status`, true)
            message.channel.send(embed);
        }
    }
}