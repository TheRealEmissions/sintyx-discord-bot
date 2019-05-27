module.exports = function startReactionCache(client) {
    /*

    fetching the message
    create new reaction collector based on ID
    do stuff

    */

    // USERNAME COLOUR

    let ec = client.storage.emojiCharacters;
    client.channels.find(x => x.id == client.storage.messageCache['usernameColor'].channel).messages.fetch(client.storage.messageCache['usernameColor'].id).then(msg => {
        let filter = (reaction, user) => ((reaction.emoji.name == ec['heart']) || (reaction.emoji.name == ec['yellow_heart']) || (reaction.emoji.name == ec['blue_heart']) || (reaction.emoji.name == ec['green_heart']) || (reaction.emoji.name == ec['purple_heart']) || (reaction.emoji.name == ec['black_heart'])) && user.id !== "567441952640073738";
        let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
        collector.on('collect', (reaction) => {
            reaction.users.remove(reaction.users.last());
            if (!msg.guild.roles.find(x => x.name == ("Red") || ("Yellow") || ("Green") || ("Blue") || ("Purple") || ("Black"))) {
                return;
            } else {
                let redRole = msg.guild.roles.find(x => x.name == "Red"),
                    yellowRole = msg.guild.roles.find(x => x.name == "Yellow"),
                    greenRole = msg.guild.roles.find(x => x.name == "Green"),
                    blueRole = msg.guild.roles.find(x => x.name == "Blue"),
                    purpleRole = msg.guild.roles.find(x => x.name == "Purple"),
                    blackRole = msg.guild.roles.find(x => x.name == "Black");

                function checkRoles(msg, reaction) {
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == redRole.id)) {
                        msg.guild.member(reaction.users.last()).roles.remove(redRole.id);
                    }
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == yellowRole.id)) {
                        msg.guild.member(reaction.users.last()).roles.remove(yellowRole.id);
                    }
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == greenRole.id)) {
                        msg.guild.member(reaction.users.last()).roles.remove(greenRole.id);
                    }
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == blueRole.id)) {
                        msg.guild.member(reaction.users.last()).roles.remove(blueRole.id);
                    }
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == purpleRole.id)) {
                        msg.guild.member(reaction.users.last()).roles.remove(purpleRole.id);
                    }
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == blackRole.id)) {
                        msg.guild.member(reaction.users.last()).roles.remove(blackRole.id);
                    }
                }

                let Discord = require(`discord.js`);

                function removedRoleEmbed(member) {
                    let embed = new Discord.MessageEmbed()
                        .setDescription(`<@${member.id}> reset your username colour!`)
                        .setColor(msg.guild.member(client.user).displayHexColor)
                    return embed;
                }

                function addedRoleEmbed(member, role) {
                    let embed = new Discord.MessageEmbed()
                        .setDescription(`<@${member.id}> altered your username colour to ${role.name}!`)
                        .setColor(msg.guild.member(client.user).displayHexColor)
                    return embed;
                }

                if (reaction.emoji.name == ec['heart']) {
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == redRole.id)) {
                        checkRoles(msg, reaction);
                        msg.channel.send(removedRoleEmbed(reaction.users.last())).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    } else {
                        checkRoles(msg, reaction);
                        msg.guild.member(reaction.users.last()).roles.add(redRole.id);
                        msg.channel.send(addedRoleEmbed(reaction.users.last(), redRole)).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    }
                } else
                if (reaction.emoji.name == ec['yellow_heart']) {
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == yellowRole.id)) {
                        checkRoles(msg, reaction);
                        msg.channel.send(removedRoleEmbed(reaction.users.last())).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    } else {
                        checkRoles(msg, reaction);
                        msg.guild.member(reaction.users.last()).roles.add(yellowRole.id);
                        msg.channel.send(addedRoleEmbed(reaction.users.last(), yellowRole)).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    }
                } else
                if (reaction.emoji.name == ec['green_heart']) {
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == greenRole.id)) {
                        checkRoles(msg, reaction);
                        msg.channel.send(removedRoleEmbed(reaction.users.last())).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    } else {
                        checkRoles(msg, reaction);
                        msg.guild.member(reaction.users.last()).roles.add(greenRole.id);
                        msg.channel.send(addedRoleEmbed(reaction.users.last(), greenRole)).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    }
                } else
                if (reaction.emoji.name == ec['blue_heart']) {
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == blueRole.id)) {
                        checkRoles(msg, reaction);
                        msg.channel.send(removedRoleEmbed(reaction.users.last())).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    } else {
                        checkRoles(msg, reaction);
                        msg.guild.member(reaction.users.last()).roles.add(blueRole.id);
                        msg.channel.send(addedRoleEmbed(reaction.users.last(), blueRole)).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    }
                } else
                if (reaction.emoji.name == ec['purple_heart']) {
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == purpleRole.id)) {
                        checkRoles(msg, reaction);
                        msg.channel.send(removedRoleEmbed(reaction.users.last())).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    } else {
                        checkRoles(msg, reaction);
                        msg.guild.member(reaction.users.last()).roles.add(purpleRole.id);
                        msg.channel.send(addedRoleEmbed(reaction.users.last(), purpleRole)).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    }
                } else
                if (reaction.emoji.name == ec['black_heart']) {
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == blackRole.id)) {
                        checkRoles(msg, reaction);
                        msg.channel.send(removedRoleEmbed(reaction.users.last())).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    } else {
                        checkRoles(msg, reaction);
                        msg.guild.member(reaction.users.last()).roles.add(blackRole.id);
                        msg.channel.send(addedRoleEmbed(reaction.users.last(), blackRole)).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    }
                }
            }
        });
    });
}