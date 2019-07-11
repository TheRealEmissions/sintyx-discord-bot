module.exports = class setnick {
    constructor() {
        this.name = 'setnick',
        this.alias = [],
        this.usage = '-setnick <@user/user ID> <nickname>',
        this.category = 'administration',
        this.description = 'Change the nickname of a user'
    }

    async run(client, message, args) {
        if (message.member.roles.find(x => x.name == "Owner")) {
            let member = Boolean(message.mentions.members.first()) ? message.mentions.members.first() : message.guild.members.get(`${args[1]}`);
            if (!member) {
                return message.channel.send(`I could not find that member!`);
            }
            member.edit({
                nick: args[2].toString()
            }).then(() => {
                message.channel.send(`Altered **${member.user.username}${member.user.username.endsWith(`s`) ? `'` : `'s`}** nickname to \`${args[2].toString()}\``);
            }).catch(err => message.channel.send(`I could not change that member's nickname! Error: ${err}`));
        }
    }
}