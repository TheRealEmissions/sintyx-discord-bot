module.exports = class ban {
    constructor() {
        this.name = 'ban',
        this.alias = ["blacklist"],
        this.usage = '-ban <user> [reason]',
        this.category = 'moderation',
        this.description = 'Blacklist a user from the Discord'
    }

    async run(client, message, args) {
        /*

        PLAN:

        -ban -blacklist @user reason
        questioned without args

        */
        if (!args[1]) {
            // collection system
            /*

            user -> time -> reason

            */
            let embeds = {
                main: new client.modules.Discord.MessageEmbed()
                    .setTitle(`**Ban** - Wizard`)
                    .setColor(message.guild.member(client.user).displayHexColor),
                1: new client.modules.Discord.MessageEmbed()
                    .setDescription(`${client.storage.emojiCharacters[1]} Please tag the user you wish to ban or type their ID.`),
                2: new client.modules.Discord.MessageEmbed()
                    .setDescription(`${client.storage.emojiCharacters[2]} How long is the duration of this ban? *(${client.storage.emojiCharacters['!']} for permanent)*`),
                3: new client.modules.Discord.MessageEmbed()
                    .setDescription(`${client.storage.emojiCharacters[3]} What is the reason of this ban? *(${client.storage.emojiCharacters['?']} for no reason)*`)
            }
            message.channel.send(embeds.main).then(mainEmbed => {
                message.channel.send(embeds[1]).then(wizardMsg => {
                    let msgCollector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                        max: 1
                    });
                    msgCollector.on('collect', oneMsg => {
                        msgCollector.stop();
                        oneMsg.delete();
                        let user = Boolean(oneMsg.mentions.users.first()) ? oneMsg.mentions.users.first() : message.guild.members.find(x => x.id == oneMsg.toString()).user;
                        let member = Boolean(oneMsg.mentions.users.first()) ? oneMsg.mentions.members.first() : message.guild.members.find(x => x.id == oneMsg.toString());
                        embeds.main = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**Ban** - Wizard`)
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .addField(`User`, user.tag)
                        mainEmbed.edit(embeds.main);
                        wizardMsg.edit(embeds[2]).then(() => {
                            wizardMsg.react(client.storage.emojiCharacters['!']);
                            let msgCollector2 = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                max: 1
                            });
                            let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['!'] && user.id == message.author.id,
                                reacCollector = new client.modules.Discord.ReactionCollector(wizardMsg, filter, {}),
                                duration;
                            reacCollector.on('collect', reaction => {
                                reacCollector.stop();
                                msgCollector2.stop();
                                reaction.users.remove(reaction.users.first());
                                reaction.users.remove(reaction.users.last());
                                duration = 'Permanent';
                                runThird();
                            });
                            msgCollector2.on('collect', twoMsg => {
                                twoMsg.delete();
                                reacCollector.stop();
                                msgCollector2.stop();
                                message.reactions.removeAll();
                                duration = twoMsg.content;
                                runThird();
                            });

                            function runThird() {
                                embeds.main = new client.modules.Discord.MessageEmbed()
                                    .setTitle(`**Ban** - Wizard`)
                                    .setColor(message.guild.member(client.user).displayHexColor)
                                    .addField(`User`, user.tag, true)
                                    .addField(`Duration`, duration, true)
                                mainEmbed.edit(embeds.main);
                                wizardMsg.edit(embeds[3]).then(() => {
                                    wizardMsg.react(client.storage.emojiCharacters['?']);
                                    let msgCollector3 = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                        max: 1
                                    }),
                                        filter2 = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['?'] && user.id == message.author.id,
                                        reacCollector2 = new client.modules.Discord.ReactionCollector(wizardMsg, filter2, {}),
                                        reason;
                                    msgCollector3.on('collect', thirdMsg => {
                                        thirdMsg.delete();
                                        msgCollector3.stop();
                                        reacCollector2.stop();
                                        reason = thirdMsg.content;
                                        runForth();
                                    });
                                    reacCollector2.on('collect', reaction => {
                                        msgCollector3.stop();
                                        reacCollector2.stop();
                                        reason = `No reason provided`;
                                        runForth();
                                    });

                                    function runForth() {
                                        embeds.main = new client.modules.Discord.MessageEmbed()
                                            .setTitle(`**Ban** - Wizard`)
                                            .setColor(message.guild.member(client.user).displayHexColor)
                                            .addField(`User`, user.tag, true)
                                            .addField(`Duration`, duration, true)
                                            .addField(`Reason`, "```" + reason + "```", true)
                                        mainEmbed.edit(embeds.main).then(() => {
                                            wizardMsg.delete();
                                            mainEmbed.react(client.storage.emojiCharacters['white_check_mark']);
                                            let filter3 = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id == message.author.id;
                                            let reacCollector3 = new client.modules.Discord.ReactionCollector(mainEmbed, filter3, {});
                                            reacCollector3.on('collect', reaction => {
                                                reacCollector3.stop();
                                                embeds.main = new client.modules.Discord.MessageEmbed()
                                                    .setTitle(`**Ban** - Wizard`)
                                                    .setColor(message.guild.member(client.user).displayHexColor)
                                                    .addField(`User`, user.tag, true)
                                                    .addField(`Duration`, duration, true)
                                                    .addField(`Reason`, "```" + reason + "```", true)
                                                    .setFooter(`${client.storage.emojiCharacters['white_check_mark']} Banned ${user.tag} at ${new Date()}`)
                                                mainEmbed.edit(embeds.main);
                                                let blacklistedRole = message.guild.roles.find(x => x.name == "Blacklisted");
                                                if (duration !== "Permanent") {
                                                    member.roles.add([blacklistedRole.id]).then(() => {
                                                        setTimeout(() => {
                                                            if (member.roles.find(x => x.name == "Blacklisted")) {
                                                                member.roles.remove([blacklistedRole.id]);
                                                                let embed2 = new client.modules.Discord.MessageEmbed()
                                                                    .setTitle(`**You were unbanned on ${message.guild}!**`)
                                                                    .setColor(message.guild.member(client.user).displayHexColor)
                                                                    .setDescription(`Hey! Your ban has expired on ${message.guild} and your Blacklisted role has been removed! Please do not break the rules again! ${client.storage.emojiCharacters['thumbs_up']}`)
                                                                    .setTimestamp();
                                                                user.send(embed2);
                                                            } else {
                                                                return;
                                                            }
                                                        }, client.modules.ms(duration));
                                                    })
                                                    let embed = new client.modules.Discord.MessageEmbed()
                                                        .setTitle(`**You were banned on ${message.guild}!**`)
                                                        .setColor(message.guild.member(client.user).displayHexColor)
                                                        .setDescription(`Unfortunately, you were banned on ${message.guild}. However, this isn't the end! Our banning system doesn't remove you from our guild but instead applies a blacklisted role to yourself. Please await your ban - unless it is permanent...`)
                                                        .addField(`Moderator`, `${message.author.tag}\n*(${message.author.id})*`, true)
                                                        .addField(`Duration`, duration, true)
                                                        .addField(`Reason`, "```" + reason + "```", true)
                                                        .setTimestamp();
                                                    user.send(embed);
                                                } else {
                                                    member.roles.add([blacklistedRole.id]);
                                                    let embed = new client.modules.Discord.MessageEmbed()
                                                        .setTitle(`**You were banned on ${message.guild}!**`)
                                                        .setColor(message.guild.member(client.user).displayHexColor)
                                                        .setDescription(`Unfortunately, you were banned on ${message.guild} - this ban is also permanent, meaning there is not an end to this ban. If you wish to appeal this ban, please contact the moderator that banned you or a known staff member for the guild.`)
                                                        .addField(`Moderator`, `${message.author.tag}\n*(${message.author.id})*`, true)
                                                        .addField(`Duration`, duration, true)
                                                        .addField(`Reason`, "```" + reason + "```", true)
                                                        .setTimestamp();
                                                    user.send(embed);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            });
        } else {
            if (Boolean(message.mentions.users.first())) {
                let embed = new client.modules.Discord.MessageEmbed()
                    .setTitle(`**Ban** - Wizard`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setDescription(`How long is the duration of this ban? *(${client.storage.emojiCharacters['!']} for permanent)*`)
                message.channel.send(embed).then(msg => {
                    msg.react(client.storage.emojiCharacters['!']).catch(err => {
                        console.error(err);
                        message.channel.send(client.functions.errorEmbed(`Ban`, `B005`, message.guild.member(client.user).displayHexColor));
                    })
                    let reason = Boolean(args[2]) ? message.content.slice(args[0].length + args[1].length + 2) : `No reason provided`,
                        blacklistedRole = message.guild.roles.find(x => x.name == "Blacklisted"),
                        user = message.mentions.members.first();
                    let msgCollector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                        max: 1
                    });
                    let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['!'] && user.id == message.author.id;
                    let reacCollector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    reacCollector.on('collect', reaction => {
                        msgCollector.stop();
                        reacCollector.stop();
                        reaction.users.remove(reaction.users.first());
                        user.roles.add([blacklistedRole.id]).catch(err => {
                            console.error(err);
                            message.channel.send(client.functions.errorEmbed(`Ban`, `B006`, message.guild.member(client.user).displayHexColor));
                        })
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**You were banned on ${message.guild}!**`)
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`Unfortunately, you were banned on ${message.guild} - this ban is also permanent, meaning there is not an end to this ban. If you wish to appeal this ban, please contact the moderator that banned you or a known staff member for the guild.`)
                            .addField(`Moderator`, `${message.author.tag}\n*(${message.author.id})*`, true)
                            .addField(`Duration`, `Permanent`, true)
                            .addField(`Reason`, "```" + reason + "```")
                            .setTimestamp();
                        message.mentions.users.first().send(embed).catch(err => {
                            console.error(err);
                            message.channel.send(client.functions.errorEmbed(`Ban`, `B003`, message.guild.member(client.user).displayHexColor));
                        })
                        let embed2 = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**Ban** - Wizard`)
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .addField(`User`, message.mentions.users.first().tag, true)
                            .addField(`Duration`, `Permanent`, true)
                            .addField(`Reason`, "```" + reason + "```", true)
                            .setFooter(`${client.storage.emojiCharacters['white_check_mark']} Banned ${message.mentions.users.first().tag} at ${new Date()}`)
                        msg.edit(embed2).catch(err => {
                            console.error(err);
                            message.channel.send(client.functions.errorEmbed(`Ban`, `B004`, message.guild.member(client.user).displayHexColor));
                        })
                    });
                    msgCollector.on('collect', timeMsg => {
                        msgCollector.stop();
                        reacCollector.stop();
                        msg.reactions.removeAll();
                        user.roles.add([blacklistedRole.id]).then(() => {
                            setTimeout(() => {
                                if (user.roles.find(x => x.id == blacklistedRole.id)) {
                                    user.roles.remove([blacklistedRole.id]);
                                    let embed2 = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`**You were unbanned on ${message.guild}!**`)
                                        .setColor(message.guild.member(client.user).displayHexColor)
                                        .setDescription(`Hey! Your ban has expired on ${message.guild} and your Blacklisted role has been removed! Please do not break the rules again! ${client.storage.emojiCharacters['thumbs_up']}`)
                                        .setTimestamp();
                                    message.mentions.users.first().send(embed2);
                                } else {
                                    return;
                                }
                            }, client.modules.ms(timeMsg.toString()));
                        }).catch(err => {
                            console.error(err);
                            message.channel.send(client.functions.errorEmbed(`Ban`, `B006`, message.guild.member(client.user).displayHexColor));
                        })
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**Ban** - Wizard`)
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .addField(`User`, message.mentions.users.first().tag, true)
                            .addField(`Duration`, timeMsg, true)
                            .addField(`Reason`, "```" + reason + "```", true)
                            .setFooter(`${client.storage.emojiCharacters['white_check_mark']} Banned ${message.mentions.users.first().tag} at ${new Date()}`)
                        msg.edit(embed).catch(err => {
                            console.error(err);
                            message.channel.send(client.functions.errorEmbed(`Ban`, `B004`, message.guild.member(client.user).displayHexColor));
                        })
                        let embed2 = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**You were banned on ${message.guild}!**`)
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`Unfortunately, you were banned on ${message.guild}. However, this isn't the end! Our banning system doesn't remove you from our guild but instead applies a blacklisted role to yourself. Please await your ban - unless it is permanent...`)
                            .addField(`Moderator`, `${message.author.tag}\n*(${message.author.id})*`, true)
                            .addField(`Duration`, timeMsg, true)
                            .addField(`Reason`, "```" + reason + "```", true)
                            .setTimestamp();
                        message.mentions.users.first().send(embed2).catch(err => {
                            console.error(err);
                            message.channel.send(client.functions.errorEmbed(`Ban`, `B003`, message.guild.member(client.user).displayHexColor));
                        })
                    });
                }).catch(err => {
                    console.error(err);
                    message.channel.send(client.functions.errorEmbed(`Ban`, `B002`, message.guild.member(client.user).displayHexColor));
                });
            } else {
                message.channel.send(client.functions.errorEmbed(`Ban`, `B001`, message.guild.member(client.user).displayHexColor));
            }
        }
    }
}