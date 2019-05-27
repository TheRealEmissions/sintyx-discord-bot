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
                    message.delete();
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
                .addField(`-urban <term/phrase>`, `Search a term or phrase on the Urban Dictionary!`, true)
                .addField(`-stats`, `View statistics regarding the bot and the server`, true)
            message.channel.send(embed).then(msg => {
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 30000);
            });
        } else
        if (args[1].toString() == "tickets") {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Help Menu** - Tickets`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`To view a detailed description for any given command, please type: ` + "`" + `-help info <command>` + "`")
                .addField(`-support (reason)`, `Open a support ticket with an optional reason`)
                .addField(`-close (reason)`, `Close a support ticket with an optional reason`)
            message.channel.send(embed).then(msg => {
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 30000);
            });
        } else
        if (args[1].toString() == "moderation") {

        } else
        if (args[1].toString() == "administration") {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Help Menu** - Administration`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`To view a detailed description for any given command, please type: ` + "`" + `-help info <command>` + "`")
                .addField(`-errorcode <code>`, `Look up an error code to view its meaning`, true)
                .addField(`-test`, `Command for Emissions`, true)
            message.channel.send(embed).then(msg => {
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 30000);
            });
        } else
        if (args[1].toString() == "info") {
            if (!args[2]) {
                return;
            }
            let info = client.storage.helpInfo[`${args[2].toString()}`];
            if (!info) {
                let embed = new client.modules.Discord.MessageEmbed()
                    .setTitle(`**Help Menu** - Info: ${args[2].toString()}`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setDescription(`This command doesn't exist and therefore I cannot show you any information about it! *(Error H001)*`)
                message.channel.send(embed).then(msg => {
                    setTimeout(() => {
                        message.delete();
                        msg.delete();
                    }, 30000);
                });
            } else {
                let embed = new client.modules.Discord.MessageEmbed()
                    .setTitle(`**Help Menu** - Info: ${args[2].toString()}`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setDescription(client.storage.helpInfo[`${args[2].toString()}`].description)
                    .addField(`Example use:`, client.storage.helpInfo[`${args[2].toString()}`].exampleUse)
                    .addField(`Aliases:`, client.storage.helpInfo[`${args[2].toString()}`].aliases)
                message.channel.send(embed);
            }
        }
    }
};