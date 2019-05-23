module.exports = class help {
    constructor() {
        this.name = 'help',
            this.alias = ["guide", "helpme", "h"],
            this.usage = `-help`
    }

    async run(client, message, args) {
        if (!args[1]) {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Help Menu**`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`To view a detailed description for any given command, please type: ` + "`" + `-help info <command>` + "`")
                .addField(`Misc`, `Contains all miscellaneous commands that do not fit a category`, true)
                .addField(`Tickets`, `Commands related to the ticket system`, true)
                .addField(`Moderation`, `Commands relating to moderation within the Discord`, true)
                .addField(`Administration`, `Contains the commands that are only available to administrators`, true)
            message.channel.send(embed).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 30000);
            });
        } else
        if (args[1].toString() == "misc") {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Help Menu** - Miscellaneous`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`To view a detailed description for any given command, please type: ` + "`" + `-help info <command>` + "`")
                .addField(`-help`, `You can use this command to view the base help menu`, true)
                .addField(`-errorcode`, `If you have received an Error Code from the bot, you can check what it means using this command.`, true)
                .addField(`-urban`, `Search a term or phrase on the Urban Dictionary!`, true)
                .addField(`-stats`, `View statistics regarding the bot and the server`, true)
            message.channel.send(embed).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 30000);
            });
        } else
        if (args[1].toString() == "tickets") {
            
        } else
        if (args[1].toString() == "moderation") {

        } else
        if (args[1].toString() == "info") {
            if (args[2].toString() == "help") {
                let embed = new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setTitle(`**Help Menu** - Info: Help`)
                    .setDescription(`This command relays to the user all the available commands a user has access to. It can be used to find out what the functions of commands are and how they act and respond to a user running them.`)
                    .addField(`Example use:`, `-help\n-help help\n-help stats`, true)
                    .addField(`Aliases:`, `-guide\n-helpme\n-h`, true);
                message.channel.send(embed).then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 30000);
                });
            } else
            if (args[2].toString() == "stats") {
                let embed = new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setTitle(`**Help Menu** - Info: Stats`)
                    .setDescription(`This command displays all the information regarding the bot and the server. It can be useful to run this command if you believe the bot or the server is running slow.`)
                    .addField(`Example use:`, `-stats`, true)
                    .addField(`Aliases:`, `-statistics\n-info\n-botinfo\n-status`, true);
                message.channel.send(embed).then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 30000);
                });
            } else
            if (args[2].toString() == "urban") {
                let embed = new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setTitle(`**Help Menu** - Info: Urban`)
                    .setDescription(`This command will research the Urban Dictionary directly the term or phrase you input into the command! It will display the first definition shown on the Urban Dictionary website and will, furthermore, display the up and down-votes on that particular definition. You can view the page itself by clicking on the defintion displayed.`)
                    .addField(`Example use:`, `-urban guy\n-urban White House\n-urban The President`, true)
                    .addField(`Aliases:`, `-urbandictionary`, true);
                message.channel.send(embed).then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 30000);
                })
            }
        }
    }
};