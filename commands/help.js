module.exports = class help {
    constructor() {
        this.name = 'help',
            this.alias = ["guide", "helpme", "h"],
            this.usage = `-help`
    }

    async run(client, message, args) {
        if (!args[1]) {
            message.channel.send(`:mailbox_with_mail: I have sent you the help menu in your DMs!`);
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Help Menu**`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`To view a detailed description for any given command, please type: ` + "`" + `-help <command>` + "`")
                .addField(`-help`, `Display this menu in your chosen environment`, true)
                .addField(`-stats`, `View the statistics regarding the bot and the server!`, true)
                .addField(`-urban`, `Research a term or phrase on the Urban Dictionary!`, true);
            message.author.send(embed);
        } else
        if (args[1].toString() == "help") {
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setTitle(`**Help Menu** - Help`)
                .setDescription(`This command relays to the user all the available commands a user has access to. It can be used to find out what the functions of commands are and how they act and respond to a user running them.`)
                .addField(`Example use:`, `-help\n-help help\n-help stats`, true)
                .addField(`Aliases:`, `-guide\n-helpme\n-h`, true);
            message.channel.send(embed);
        } else
        if (args[1].toString() == "stats") {
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setTitle(`**Help Menu** - Stats`)
                .setDescription(`This command displays all the information regarding the bot and the server. It can be useful to run this command if you believe the bot or the server is running slow.`)
                .addField(`Example use:`, `-stats`, true)
                .addField(`Aliases:`, `-statistics\n-info\n-botinfo\n-status`, true);
            message.channel.send(embed);
        } else
        if (args[1].toString() == "urban") {
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setTitle(`**Help Menu** - Urban`)
                .setDescription(`This command will research the Urban Dictionary directly the term or phrase you input into the command! It will display the first definition shown on the Urban Dictionary website and will, furthermore, display the up and down-votes on that particular definition. You can view the page itself by clicking on the defintion displayed.`)
                .addField(`Example use:`, `-urban guy\n-urban White House\n-urban The President`, true)
                .addField(`Aliases:`, `-urbandictionary`, true);
            message.channel.send(embed);
        }
    }
};