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

                function processRole(role) {
                    if (msg.guild.member(reaction.users.last()).roles.find(x => x.id == role.id)) {
                        checkRoles(msg, reaction);
                        msg.channel.send(removedRoleEmbed(reaction.users.last())).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    } else {
                        checkRoles(msg, reaction);
                        msg.guild.member(reaction.users.last()).roles.add(role.id);
                        msg.channel.send(addedRoleEmbed(reaction.users.last(), role)).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    }
                }
                processRole(role);
            }
        });
    });

    // trello system

    let { startTrelloCollector } = require(`../functions`);

    async function startStageOne(_callback) {
        client.models.trelloCards.find({
            "card_stage": 1
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                _callback();
                return;
            } else {
                db.forEach(async(entry) => {
                    let msg = await client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageOne).messages.fetch(entry.message_id);
                    let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['thumbs_up'] && user.id !== client.user.id;
                    let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    _callback();
                    collector.on('collect', reaction => {
                        collector.stop();
                        msg.delete();
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**${entry.card_id}** - ${entry.embed_title}`)
                            .setDescription(entry.embed_desc)
                            .addField(`Task:`, entry.embed_task)
                        client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageTwo).send(embed).then(message => {
                            message.react(client.storage.emojiCharacters['double_arrow_forward']);
                            client.models.trelloCards.findOne({
                                "_id": entry._id
                            }, (err, db) => {
                                if (err) return console.error(err);
                                db.card_stage = 2;
                                db.message_id = message.id;
                                db.save((err) => {
                                    console.error(err);
                                    startTrelloCollector(client, 2, db.card_id);
                                });
                            });
                        });
                    });
                });
            }
        });
    }

    function startStageTwo(_callback) {
        client.models.trelloCards.find({
            "card_stage": 2
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                _callback();
                return;
            } else {
                db.forEach(async(entry) => {
                    let msg = await client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageTwo).messages.fetch(entry.message_id);
                    let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['double_arrow_forward'] && user.id !== client.user.id;
                    let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    _callback();
                    collector.on('collect', reaction => {
                        collector.stop();
                        msg.delete();
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**${entry.card_id}** - ${entry.embed_title}`)
                            .setDescription(entry.embed_desc)
                            .addField(`Task:`, entry.embed_task)
                        client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageThree).send(embed).then(message => {
                            message.react(client.storage.emojiCharacters['white_check_mark']);
                            client.models.trelloCards.findOne({
                                "_id": entry._id
                            }, (err, db) => {
                                if (err) return console.error(err);
                                db.card_stage = 3;
                                db.message_id = message.id;
                                db.save((err) => {
                                    console.error(err);
                                    startTrelloCollector(client, 3, db.card_id);
                                });
                            });
                        });
                    });
                })
            }
        });
    }

    function startStageThree() {
        client.models.trelloCards.find({
            "card_stage": 3
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return;
            } else {
                db.forEach(async(entry) => {
                    let msg = await client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageThree).messages.fetch(entry.message_id);
                    let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id !== client.user.id;
                    let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    collector.on('collect', reaction => {
                        collector.stop();
                        msg.delete();
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**${entry.card_id}** - ${entry.embed_title}`)
                            .setDescription(entry.embed_desc)
                            .addField(`Task:`, entry.embed_task)
                        client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageFour).send(embed).then(message => {
                            client.models.trelloCards.findOne({
                                "_id": entry._id
                            }, (err, db) => {
                                if (err) return console.error(err);
                                db.card_stage = 4;
                                db.message_id = message.id;
                                db.save((err) => console.error(err));
                            });
                        });
                    });
                });
            }
        })
    }

    startStageOne(function() {
        startStageTwo(function() {
            startStageThree();
        });
    });
}