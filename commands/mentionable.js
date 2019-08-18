module.exports = class mentionable {
    constructor() {
        this.name = 'mentionable',
            this.alias = [],
            this.usage = '-mentionable <@role/role ID>',
            this.category = 'administration',
            this.description = 'Toggle making a role mentionable on/off'
    }

    async run(client, message, args) {
        if ((message.member.roles.find(x => x.name == "Management")) || (message.member.roles.get('567441043822477322'))) {
            let role = Boolean(message.mentions.roles.first()) ? message.mentions.roles.first() : message.guild.roles.get(`${args[1]}`);
            if (!role) {
                return message.channel.send(`Please either mention a role or type its ID.`).then(msg => setTimeout(() => msg.delete(), 5000));
            }
            role.edit({
                mentionable: role.mentionable ? false : true
            }).then(() => {
                message.channel.send(`Altered mentionability of **${role.name}** to **${role.mentionable ? 'true' : 'false'}**`);
            });
        }
    }
}