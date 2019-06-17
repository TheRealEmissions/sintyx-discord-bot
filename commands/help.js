module.exports = class help {
    constructor() {
        this.name = 'help',
            this.alias = ["guide", "helpme", "h"],
            this.usage = `-help <category>/<info> <command>`,
            this.category = 'misc',
            this.description = 'You can use this command to view the base help menu'
    }

    async run(client, message, args) {
        let categories = ["misc", "tickets", "moderation", "administration", "user"];
        if (!args[1]) {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Help Menu**`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`To view a detailed description for any given command, please type: ` + "`" + `-help info <command>` + "`")
                .addField(`Misc`, `Contains all miscellaneous commands that do not fit a category`, true)
                .addField(`User`, `Commands related to users`, true)
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
        if (categories.indexOf(args[1].toLowerCase().toString()) >= 0) {
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Help Menu** - ${args[1].toString().charAt(0).toUpperCase() + args[1].toString().slice(1)}`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`To view a detailed description for any given command, please type: ` + "`" + `-help info <command>` + "`")
            message.channel.send(embed).then(msg => {
                client.modules.fs.readdir(`./commands/`, async (err, files) => {
                    if (err) return console.error(err);
                    files.forEach(file => {
                        if (!file.endsWith(".js")) return;
                        file = require(`./${file}`);
                        let command = new file();
                        if (command.category !== args[1].toString()) return;
                        msg.edit(embed.addField(command.usage, command.description, true));
                    });
                });
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