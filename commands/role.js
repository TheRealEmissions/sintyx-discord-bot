module.exports = class role {
    constructor() {
        this.name = 'role',
            this.alias = [],
            this.usage = '-role <options: @user/add/remove/toggle/removeall/all/bots/humans/in> <info>',
            this.category = 'administration',
            this.description = 'Add/remove role(s) from user(s)'
    }

    async run(client, message, args) {
        if (message.member.roles.find(x => x.name == "Owner")) {
            if (args[1].toLowerCase() == "add") {

            } else
            if (args[1].toLowerCase() == "remove") {

            } else
            if (args[1].toLowerCase() == "toggle") {

            } else
            if (args[1].toLowerCase() == "removeall") {

            } else
            if (args[1].toLowerCase() == "all") {} else {
                let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(`${args[1]}`);
                if (!member) {
                    return message.channel.send(`I could not that user!`);
                }
                if (!args[2]) {
                    return message.channel.send(`You must specify a role to add/remove to or from that user!`);
                }
                let role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${args[2]}`);
                if (!role) {
                    return message.channel.send(`I couldn't find that role on this guild!`);
                }
                if (member.roles.find(x => x.id == role.id)) {
                    member.roles.remove(role).then(() => {
                        return message.channel.send(`Removed the role **${role.name}** from **${member.user.username}**!`)
                    }).catch(err => message.channel.send(`I could not remove the role **${role.name}** from **${member.user.username}**! Error: ${err}`));
                } else {
                    member.roles.add(role).then(() => {
                        return message.channel.send(`Added the role **${role.name}** to **${member.user.username}**!`)
                    }).catch(err => message.channel.send(`I could not add the role **${role.name}** to **${member.user.username}**! Error: ${err}`))
                }
            }
        }
    }
}