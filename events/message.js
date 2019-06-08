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
                            user_coins: 0
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
                            xp_ping: false,
                            coin_ping: false
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
            one(function() {
                two(function() {
                    _callback();
                });
            });
        }

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
                        "user_id": message.author.id
                    }, (err, db) => {
                        if (err) return console.error(err);
                        if (db.xp_ping == true) {
                            message.channel.send(`<@${message.author.id}> **+${xpToAdd} XP**`).then(msg => {
                                setTimeout(() => {
                                    msg.delete();
                                }, 1800);
                            });
                            _callback();
                        }
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
                    db.userLevel = checkLevel;
                    let xpGained = (checkLevel - 1) * 1000;
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setDescription(`<@${message.author.id}>! You have reached **${xpGained} XP** and have ranked up to **Level ${checkLevel}**!`)
                        .setColor(message.guild.member(client.user).displayHexColor)
                    message.channel.send(embed);
                    db.save((err) => {
                        if (err) return console.error(err);
                        _callback();
                    });
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
                        if (db.coin_ping == true) {
                            message.channel.send(`<${message.author.id}> **+${coin} Coins**`).then(msg => {
                                setTimeout(() => {
                                    msg.delete();
                                }, 1800);
                            });
                        }
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
    }
}