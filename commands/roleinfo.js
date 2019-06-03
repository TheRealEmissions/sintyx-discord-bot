module.exports = class roleinfo {
    constructor() {
        this.name = 'roleinfo',
        this.alias = [],
        this.usage = '-roleinfo'
    }

    async run(client, message, args) {
        args[1] = message.content.slice(args[0].length + 1);
        let role;
        Boolean(message.mentions.roles.first()) ? role = message.mentions.roles.first() : role = message.guild.roles.find(x => x.name == args[1]);
        if (!role) {
            return;
        } else {
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .addField(`ID`, role.id, true)
                .addField(`Name`, role.name, true)
                .addField(`Color`, role.hexColor, true)
                .addField(`Mention`, "`<@&" + role.id + ">`", true)
                .addField(`Members`, role.members.array().length, true)
                .addField(`Position`, role.position, true)
                .addField(`Mentionable`, role.mentionable, true)
                .addField(`Hoisted`, role.hoist, true)
                .setFooter(`Created at:`)
                .setTimestamp(role.createdAt);
            message.channel.send(embed);
        }
    }
}