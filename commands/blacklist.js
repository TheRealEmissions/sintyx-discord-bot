module.exports = class blacklist {
    constructor() {
        this.name = 'blacklist',
            this.alias = ["ban"],
            this.usage = '-ban <user> [reason]',
            this.category = 'moderation',
            this.description = 'Blacklist a user from the Discord'
    }

    async run(client, message, args) {
        if (message.member.roles.find(x => x.name == "Owner")) {
            let random_string = require(`crypto-random-string`);
            let id = random_string({
                length: 10,
                type: 'base64'
            });
            let mE = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Ban** - Wizard`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .addField(`Punishment ID`, id)
            message.channel.send(mE).then(mainEmbed => {
                let stageOne = new client.modules.Discord.MessageEmbed()
                    .setDescription(`${client.storage.emojiCharacters[1]} Please tag or type the ID of the user you wish to ${args[0].toLowerCase().slice(1)}`)
                message.channel.send(stageOne).then(wizardMsg => {
                    let msgCollector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                        max: 10
                    });
                    msgCollector.on('collect', oneMsg => {
                        oneMsg.delete();
                        if ((oneMsg.mentions.users.first()) || (message.guild.members.get(oneMsg.content))) {
                            msgCollector.stop();
                            let user = Boolean(oneMsg.mentions.users.first()) ? oneMsg.mentions.users.first() : message.guild.members.get(oneMsg.content).user;
                            let member = Boolean(oneMsg.mentions.members.first()) ? oneMsg.mentions.members.first() : message.guild.members.get(oneMsg.content);
                            mE = new client.modules.Discord.MessageEmbed()
                                .setTitle(`**Ban** - Wizard`)
                                .setColor(message.guild.member(client.user).displayHexColor)
                                .addField(`Punishment ID`, id, true)
                                .addField(`User`, user.tag, true)
                            mainEmbed.edit(mE);
                            let stageTwo = new client.modules.Discord.MessageEmbed()
                                .setDescription(`${client.storage.emojiCharacters[2]} Please type the duration of the ban, for example, ` + "`" + `5d` + "`" + `, or type ` + "`" + `perm` + "`" + ` for a permanent duration.`)
                            wizardMsg.edit(stageTwo).then(() => {
                                let msgCollector2 = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                    max: 10
                                })
                                msgCollector2.on('collect', twoMsg => {
                                    twoMsg.delete();
                                    msgCollector2.stop();
                                    mE = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`**Ban** - Wizard`)
                                        .setColor(message.guild.member(client.user).displayHexColor)
                                        .addField(`Punishment ID`, id, true)
                                        .addField(`User`, user.tag, true)
                                        .addField(`Duration`, twoMsg.content.toLowerCase() == "perm" ? "Permanent" : twoMsg.content, true)
                                    mainEmbed.edit(mE);
                                    let stageThree = new client.modules.Discord.MessageEmbed()
                                        .setDescription(`${client.storage.emojiCharacters[3]} What is the reason for this ${args[0].toLowerCase().slice(1)}?`)
                                    wizardMsg.edit(stageThree).then(() => {
                                        let msgCollector3 = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                            max: 10
                                        });
                                        msgCollector3.on('collect', threeMsg => {
                                            threeMsg.delete();
                                            msgCollector3.stop();
                                            wizardMsg.delete();
                                            mE = new client.modules.Discord.MessageEmbed()
                                                .setTitle(`**Ban** - Wizard`)
                                                .setColor(message.guild.member(client.user).displayHexColor)
                                                .addField(`Punishment ID`, id, true)
                                                .addField(`User`, user.tag, true)
                                                .addField(`Duration`, twoMsg.content.toLowerCase() == "perm" ? "Permanent" : twoMsg.content, true)
                                                .addField(`Reason`, "```" + threeMsg.content + "```", true)
                                            mainEmbed.edit(mE);
                                            mainEmbed.react(client.storage.emojiCharacters['white_check_mark']).then(() => {
                                                mainEmbed.react(client.storage.emojiCharacters['x']).then(() => {
                                                    let filter = (reaction, user) => ((reaction.emoji.name == client.storage.emojiCharacters['white_check_mark']) || (reaction.emoji.name == client.storage.emojiCharacters['x'])) && user.id == message.author.id;
                                                    let reacCollector = new client.modules.Discord.ReactionCollector(mainEmbed, filter, {});
                                                    reacCollector.on('collect', reaction => {
                                                        reacCollector.stop();
                                                        if (reaction.emoji.name == client.storage.emojiCharacters['x']) {
                                                            mainEmbed.delete();
                                                            message.delete();
                                                        } else {
                                                            let blacklistedRole = message.guild.roles.find(x => x.name == "Blacklisted");
                                                            member.roles.add([blacklistedRole.id]).then(() => {
                                                                mE = new client.modules.Discord.MessageEmbed()
                                                                    .setTitle(`**Successfully banned ${user.tag}!** ${client.storage.emojiCharacters['white_check_mark']}`)
                                                                    .setColor(message.guild.member(client.user).displayHexColor)
                                                                    .addField(`Punishment ID`, id, true)
                                                                    .addField(`User`, user.tag, true)
                                                                    .addField(`Duration`, twoMsg.content.toLowerCase() == "perm" ? "Permanent" : twoMsg.content, true)
                                                                    .addField(`Reason`, "```" + threeMsg.content + "```", true)
                                                                mainEmbed.edit(mE);
                                                                let embed = new client.modules.Discord.MessageEmbed()
                                                                    .setTitle(`You have been blacklisted from **${message.guild.name}**!`)
                                                                    .setDescription(`Being blacklisted means your permissions to ${message.guild.name} has been negated. You will have access to the minimum amount of channels and are not allowed to chat throughout the Discord. Information regarding your blacklist is provided below.`)
                                                                    .addField(`Punishment ID`, id, true)
                                                                    .addField(`Moderator`, `${message.author.tag}\n*(${message.author.id})*`, true)
                                                                    .addField(`Duration`, twoMsg.content.toLowerCase() == "perm" ? "Permanent" : twoMsg.content, true)
                                                                    .addField(`Reason`, "```" + threeMsg.content + "```", true)
                                                                user.send(embed);
                                                                client.models.userProfiles.findOne({
                                                                    "user_id": user.id
                                                                }, (err, db) => {
                                                                    if (err) return new client.methods.log(client, message.guild).error(err);
                                                                    if (!db.blacklisted) db.blacklisted = true;
                                                                    let array = {
                                                                        id: id,
                                                                        type: "Blacklist",
                                                                        date: new Date(),
                                                                        moderator_id: message.author.id,
                                                                        reason: threeMsg.content,
                                                                        duration: twoMsg.content.toLowerCase() == "perm" ? "Permanent" : twoMsg.content
                                                                    }
                                                                    db.punishment_history.push(array);
                                                                    db.save((err) => new client.methods.log(client, message.guild).error(err));
                                                                })
                                                            });
                                                            if (twoMsg.content.toLowerCase() !== "perm") {
                                                                setTimeout(() => {
                                                                    member.roles.remove([blacklistedRole.id]).then(() => {
                                                                        let embed = new client.modules.Discord.MessageEmbed()
                                                                            .setTitle(`Your blacklist has expired on **${message.guild.name}**!`)
                                                                            .setDescription(`Your previous blacklist on ${message.guild.name} has expired. This means your permissions to the Discord have been restored and you can now chat again! Please do not break the rules again as you will be punished accordingly.`)
                                                                        user.send(embed);
                                                                        client.models.userProfiles.findOne({
                                                                            "user_id": user.id
                                                                        }, (err, db) => {
                                                                            if (err) return new client.methods.log(client, message.guild).error(err);
                                                                            db.blacklisted = false;
                                                                            db.save((err) => new client.methods.log(client, message.guild).error(err));
                                                                        })
                                                                    }).catch(err => {
                                                                        new client.methods.log(client, message.guild).error(err);
                                                                        client.models.userProfiles.findOne({
                                                                            "user_id": user.id
                                                                        }, (err, db) => {
                                                                            if (err) return new client.methods.log(client, message.guild).error(err);
                                                                            db.blacklisted = false;
                                                                            db.save((err) => new client.methods.log(client, message.guild).error(err));
                                                                        });
                                                                    });
                                                                }, client.modules.ms(twoMsg.content));
                                                            }
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    });
                })
            });
        }
    }
}