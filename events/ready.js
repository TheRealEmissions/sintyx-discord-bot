module.exports = (client) => {
    console.log(`[LOG] Bot successfully initialized:`);
    console.log(`- Username: ${client.user.username}`);
    console.log(`- Discriminator: ${client.user.discriminator}`);
    console.log(`- ID: ${client.user.id}`);
    let ip = "mc.sintyx.com";
    let port = "25565";
    let url = 'http://mcapi.us/server/status?ip=' + ip + '&port=' + port;

    function update() {
        client.modules.request(url, function (err, response, body) {
            if (err) console.error(err);
            body = JSON.parse(body);
            if (body.online) {
                if (body.players.now >= body.players.max) {
                    client.user.setPresence({
                            status: 'online',
                            activity: {
                                name: `the max amount of players! ${body.players.now}/${body.players.max}`,
                                type: 'WATCHING'
                            }
                        })
                        .catch(err => console.error(err));
                } else {
                    if (body.players.now < 1) {
                        client.user.setPresence({
                            status: 'idle',
                            activity: {
                                name: `${body.players.now} players on ${ip}!`,
                                type: 'WATCHING'
                            }
                        }).catch(err => console.error(err));
                    } else {
                        client.user.setPresence({
                                status: 'online',
                                activity: {
                                    name: `${body.players.now} players on ${ip}!`,
                                    type: 'WATCHING'
                                }
                            })
                            .catch(err => console.error(err));
                    }
                }
            } else {
                client.user.setPresence({
                    status: 'dnd',
                    activity: {
                        name: `The server currently isn't online!`
                    }
                }).catch(err => console.error(err));
            }
        });
    }
    update();
    client.setInterval(update, 30000);
    new client.methods.startReactionCache(client);
    new client.methods.startLeaderboardUpdates(client);
    client.models.guildSettings.find({}, (err, docs) => {
        if (err) return new client.methods.log(client).error(err);
        for (let doc of docs) {
            client.models.guildSettings.findOne({
                "guild_id": doc.guild_id
            }, (err, db) => {
                if (err) return new client.methods.log(client).error(err);
                db.xp_booster = [];
                db.coin_booster = [];
                db.save((err) => {
                    if (err) return new client.methods.log(client).error(err);
                });
            });
        }
    });
    client.models.achievementsLogs.find({}, (err, docs) => {
        if (err) return new client.methods.log(client).error(err);
        for (const doc of docs) {
            client.models.achievementsLogs.findOne({
                "user_id": doc.user_id
            }, (err, db) => {
                if (err) return new client.methods.log(client).error(err);
                db.achievements.find(x => x.type == "activeBoosts").null_amount = 0;
                db.achievements.find(x => x.type == "activeBoosts").xp_amount = 0;
                db.achievements.find(x => x.type == "activeBoosts").coin_amount = 0;
                db.save((err) => {
                    if (err) return new client.methods.log(client).error(err);
                });
            });
        }
    });
}
