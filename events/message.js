let suggestionCooldown = new Set();
module.exports = (client, message) => {
    if (message.channel.type !== "text") return;
    if (message.author.id == client.user.id) return;
    if (message.author.bot) return;
    if (message.content.toString().startsWith("-")) {
        let args = message.content.split(" ");
        let command = args[0];
        let cmd = client.commandHandler.getCommand(command);
        if (!cmd) return;
        try {
            cmd.run(client, message, args);
        } catch (err) {
            console.error(err);
        }
    } else {
        // check if userProfiles database exists
        function databaseExists(_callback) {
            function one(_callback) {
                client.models.userProfiles.findOne({
                    "user_id": message.author.id
                }, (err, db) => {
                    if (err) return console.error(err);
                    if (!db) {
                        let newdb = new client.models.userProfiles({
                            user_id: message.author.id,
                            user_xp: 0,
                            user_level: 1,
                            user_coins: 0,
                            message_count: 0
                        });
                        newdb.save(function (err) {
                            if (err) return console.error(err);
                            _callback();
                        })
                    } else {
                        _callback();
                    }
                });
            }

            function two(_callback) {
                client.models.userSettings.findOne({
                    "user_id": message.author.id
                }, (err, db) => {
                    if (err) return console.error(err);
                    if (!db) {
                        let newdb = new client.models.userSettings({
                            user_id: message.author.id,
                            options: [{
                                name: 'coin_ping',
                                boolean: false
                            }, {
                                name: 'xp_ping',
                                boolean: false
                            }]
                        });
                        newdb.save(function (err) {
                            if (err) return console.error(err);
                            _callback();
                        });
                    } else {
                        _callback();
                    }
                });
            }
            one(function () {
                two(function () {
                    _callback();
                });
            });
        }

        if (message.channel.name.toLowerCase() == "suggestions") {
            if (suggestionCooldown.has(message.author.id)) {
                message.delete();
                message.author.send(`Your recent message in #suggestions has been deleted as you are on a cooldown! The cooldown for posting suggestions is 30 seconds. Here is your suggestion in case you need it:\n` + "```" + message.content + "```");
                return;
            } else {
                suggestionCooldown.add(message.author.id);
                let embed = new client.modules.Discord.MessageEmbed()
                    .setTitle(`Suggestion from **${message.author.tag}**:`)
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setDescription(message.content)
                    .setTimestamp();
                message.channel.send(embed).then((msg) => {
                    msg.react(client.storage.emojiCharacters['white_check_mark']).then(() => msg.react(client.storage.emojiCharacters['x']));
                });
                setTimeout(() => {
                    suggestionCooldown.delete(message.author.id)
                }, 30000);
            }
        } else {
            // add xp
            function dbAddXP(_callback) {
                client.models.userProfiles.findOne({
                    "user_id": message.author.id
                }, (err, db) => {
                    if (err) return console.error(err);
                    let xpToAdd = client.functions.genNumberBetween(1, 20);
                    db.user_xp += xpToAdd;
                    db.save((err) => {
                        if (err) return console.error(err);
                        // check if xp ping enabled
                        client.models.userSettings.findOne({
                            "user_id": message.author.id,
                        }, (err, db) => {
                            if (err) return console.error(err);
                            db.options.forEach(option => {
                                if (option.name == 'xp_ping') {
                                    if (option.boolean == true) {
                                        message.channel.send(`<@${message.author.id}> **+${xpToAdd} XP**`).then(msg => {
                                            setTimeout(() => {
                                                msg.delete();
                                            }, 1800);
                                        });
                                        _callback();
                                    } else {
                                        _callback();
                                    }
                                }
                            });
                        });
                    });
                });
            }

            // check level
            function dbCheckLevel(_callback) {
                function checkXPtoLevel(level, xp) {
                    let amountToLevel = level * 1000;
                    if (xp >= amountToLevel) {
                        return level + 1
                    } else {
                        return level;
                    }
                }

                client.models.userProfiles.findOne({
                    "user_id": message.author.id
                }, (err, db) => {
                    if (err) return console.error(err);
                    let checkLevel = checkXPtoLevel(db.user_level, db.user_xp);
                    if (checkLevel !== db.user_level) {
                        db.user_level += 1;
                        let xpGained = (checkLevel - 1) * 1000;
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setDescription(`<@${message.author.id}>! You have reached **${xpGained} XP** and have ranked up to **Level ${checkLevel}**!`)
                            .setColor(message.guild.member(client.user).displayHexColor)
                        message.channel.send(embed);
                        db.save((err) => {
                            if (err) return console.error(err);
                            _callback();
                        });
                    } else {
                        _callback();
                    }
                });
            }

            // add coins
            function dbAddCoins(_callback) {
                client.models.userProfiles.findOne({
                    "user_id": message.author.id
                }, (err, db) => {
                    if (err) return console.error(err);
                    let chance = client.functions.percentChance(35);
                    if (chance == true) {
                        let coin = client.functions.genNumberBetween(1, 10);
                        db.user_coins += coin;
                        client.models.userSettings.findOne({
                            "user_id": message.author.id
                        }, (err, db) => {
                            if (err) return console.error(err);
                            db.options.forEach(option => {
                                if (option.name == 'coin_ping') {
                                    if (option.boolean == true) {
                                        message.channel.send(`<@${message.author.id}> **+${coin} Coins**`).then(msg => {
                                            setTimeout(() => {
                                                msg.delete();
                                            }, 1800);
                                        });
                                    }
                                }
                            });
                        });
                        db.save((err) => console.error(err));
                    }
                });
            }

            databaseExists(function () {
                dbAddXP(function () {
                    dbCheckLevel(function () {
                        dbAddCoins();
                    });
                });
            });

            if (message.channel.parentID == "590285807265251339") {
                client.models.supportTickets.findOne({
                    "channel_id": message.channel.id,
                }, (err, db) => {
                    if (err) return console.error(err);
                    if (!db) {
                        return console.log(`[ERROR] User typing in channel found in SUPPORT TICKETS but no SUPPORT TICKET DATABASE ENTRY can be found! (${message.channel.name} ${message.channel.id})`);
                    }
                    let logs = {
                        user_id: message.author.id,
                        message_id: message.id,
                        message_content: message.content,
                        timestamp: message.createdTimestamp
                    }
                    db.logs.push(logs);
                    db.save((err) => console.error(err));
                });
            }

            client.models.userProfiles.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return console.error(err);
                if (!db) {
                    return;
                }
                db.message_count = db.message_count + 1;
                db.save((err) => console.error(err));
            });
        }
    }
}