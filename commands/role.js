module.exports = class role {
    constructor() {
        this.name = 'role',
            this.alias = [],
            this.usage = '-role <options: @user/add/remove/toggle/removeall/all/bots/humans/in> <info>',
            this.category = 'administration',
            this.description = 'Add/remove role(s) from user(s)'
    }

    async run(client, message, args) {
        if (message.member.roles.find(x => x.name == "Management")) {
            if (args[1].toLowerCase() == "add") {
                if (!args[2]) return;
                if (!args[3]) return;
                let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(`${args[2]}`);
                if (!member) return message.channel.send(`I could not find that member on this guild!`);
                let role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${args[3]}`);
                if (!role) return message.channel.send(`I could not find that role on this guild!`);
                if (member.roles.get(role.id)) {
                    return message.channel.send(`${member.user.username} already has ${role.name}!`);
                } else {
                    return member.roles.add(role).then(() => message.channel.send(`Added **${role.name}** to **${member.user.username}**!`)).catch(err => message.channel.send(`I could not add ${role.name} to ${member.user.username}! Error: ${err}`));
                }
            } else
            if (args[1].toLowerCase() == "remove") {
                if (!args[2]) return;
                if (!args[3]) return;
                let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(`${args[2]}`);
                if (!member) return message.channel.send(`I could not find that member on this guild!`);
                let role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${args[3]}`);
                if (!role) return message.channel.send(`I could not find that role on this guild!`);
                if (member.roles.get(role.id)) {
                    return member.roles.remove(role).then(() => message.channel.send(`Removed **${role.name}** from **${member.user.username}**!`)).catch(err => message.channel.send(`I could not remove ${role.name} from ${member.user.username}! Error: ${err}`));
                } else {
                    return message.channel.send(`${member.user.username} does not have ${role.name}!`);
                }
            } else
            if (args[1].toLowerCase() == "toggle") {
                if (!args[2]) return;
                if (!args[3]) return;
                let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(`${args[2]}`);
                if (!member) return message.channel.send(`I could not find that member on this guild!`);
                let role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${args[3]}`);
                if (!role) return message.channel.send(`I could not find that role on this guild!`);
                if (member.roles.find(x => x.id == role.id)) {
                    member.roles.remove(role).then(() => {
                        return message.channel.send(`Removed the role **${role.name}** from **${member.user.username}**!`);
                    }).catch(err => message.channel.send(`I could not remove the role **${role.name}** from **${member.user.username}**! Error: ${err}`));
                } else {
                    member.roles.add(role).then(() => {
                        return message.channel.send(`Added the role **${role.name}** to **${member.user.username}**!`);
                    }).catch(err => message.channel.send(`I could not add the role **${role.name}** to **${member.user.username}**! Error: ${err}`));
                }
            } else
            if (args[1].toLowerCase() == "removeall") {
                if (!args[2]) return;
                let member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(`${args[2]}`);
                if (!member) return message.channel.send(`I could not find that member on this guild!`);
                try {
                    member.roles.forEach(role => {
                        member.roles.remove(role);
                    });
                } catch (err) {
                    message.channel.send(`I could not complete the removal of all of the users roles! Error: ${err}`);
                }
            } else
            if (args[1].toLowerCase() == "all") {
                if (!args[2]) return;
                if (!args[3]) return;
                let role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${args[3]}`);
                if (!role) return message.channel.send(`I could not find that role on this guild!`);
                if (args[2] == "add") {
                    message.guild.members.forEach(member => {
                        if (member.roles.get(role.id)) {
                            return;
                        } else {
                            member.roles.add(role).catch(err => message.channel.send(`I could not add the role ${role.name} to ${member.user.username}! Error: ${err}`));
                        }
                    });
                }
                if (args[2] == "remove") {
                    message.guild.members.forEach(member => {
                        if (!member.roles.get(role.id)) {
                            return;
                        } else {
                            member.roles.remove(role).catch(err => message.channel.send(`I could not remove the role ${role.name} from ${member.user.username}! Error: ${err}`));
                        }
                    });
                }
            } else
            if (args[1].toLowerCase() == "bots") {
                if (!args[2]) return;
                if (!args[3]) return;
                let role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${args[3]}`);
                if (!role) return message.channel.send(`I could not find that role on this guild!`);
                if (args[2] == "add") {
                    message.guild.members.forEach(member => {
                        if (member.user.bot) {
                            if (member.roles.get(role.id)) {
                                return;
                            } else {
                                member.roles.add(role).catch(err => message.channel.send(`I could not add the role ${role.name} to ${member.user.username}! Error: ${err}`));
                            }
                        } else {
                            return;
                        }
                    });
                }
                if (args[2] == "remove") {
                    message.guild.members.forEach(member => {
                        if (member.user.bot) {
                            if (member.roles.get(role.id)) {
                                member.roles.remove(role).catch(err => message.channel.send(`I could not remove the role ${role.name} from ${member.user.username}! Error: ${err}`));
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    });
                }
            } else
            if (args[1].toLowerCase() == "humans") {
                if (!args[2]) return;
                if (!args[3]) return;
                let role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${args[3]}`);
                if (!role) return message.channel.send(`I could not find that role on this guild!`);
                if (args[2] == "add") {
                    message.guild.members.forEach(member => {
                        if (!member.user.bot) {
                            if (member.roles.get(role.id)) {
                                return;
                            } else {
                                member.roles.add(role).catch(err => message.channel.send(`I could not add the role ${role.name} to ${member.user.username}! Error: ${err}`));
                            }
                        } else {
                            return;
                        }
                    });
                }
                if (args[2] == "remove") {
                    message.guild.members.forEach(member => {
                        if (!member.user.bot) {
                            if (member.roles.get(role.id)) {
                                member.roles.remove(role).catch(err => message.channel.send(`I could not remove the role ${role.name} from ${member.user.username}! Error: ${er}`));
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    })
                }
            } else
            if (args[1].toLowerCase() == "in") {
                if (!args[2]) return;
                if (!args[3]) return;
                if (!args[4]) return;
                let role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${args[2]}`);
                if (!role) return message.channel.send(`I cannot find the first role in this guild!`);
                let newRole = message.mentions.roles.last() ? message.mentions.roles.last() : message.guild.roles.get(`${args[4]}`);
                if (!newRole) return message.channel.send(`I cannot find the last role in this guild!`);
                if (args[3] == "add") {
                    message.guild.members.forEach(member => {
                        if (member.roles.get(role.id)) {
                            if (!member.roles.get(newRole.id)) {
                                member.roles.add(newRole).catch(err => message.channel.send(`I could not add **${newRole.name}** to **${member.user.username}**! Error: ${err}`));
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    });
                }
                if (args[3] == "remove") {
                    message.guild.members.forEach(member => {
                        if (member.roles.get(role.id)) {
                            if (member.roles.get(newRole.id)) {
                                member.rols.remove(newRole).catch(err => message.channel.send(`I could not remove **${newRole.name}** from **${member.user.username}**! Error: ${err}`));
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    });
                }
            } else {
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
