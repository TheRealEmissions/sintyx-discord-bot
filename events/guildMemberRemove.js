module.exports = (client, member) => {
    client.models.memberGreetings.findOne({
        "message_id": client.storage.messageCache['welcomeChannel'].greetings
    }, (err, db) => {
        if (err) return console.error(err);

        function checkDB(_callback) {
            if (!db) {
                let newdb = new client.models.memberGreetings({
                    message_id: client.storage.messageCache['welcomeChannel'].greetings
                });
                let array = {
                    id: member.id,
                    tag: member.user.tag
                }
                newdb.save((err) => {
                    if (err) console.error(err);
                    client.models.memberGreetings.findOne({
                        "message_id": client.storage.messageCache['welcomeChannel'].greetings
                    }, (err, db) => {
                        if (err) return console.error(err);
                        db.latest_memberLeave.push(array);
                        db.save((err) => {
                            if (err) console.error(err);
                            _callback();
                            return;
                        });
                    })
                });
            } else {
                if (!db.latest_memberLeave[0]) {
                    let array = {
                        id: member.id,
                        tag: member.user.tag
                    }
                    db.latest_memberLeave.push(array);
                    db.save((err) => {
                        if (err) console.error(err);
                        _callback();
                    })
                } else {
                    db.latest_memberLeave[0].id = member.id,
                        db.latest_memberLeave[0].tag = member.user.tag
                    db.save((err) => {
                        if (err) console.error(err);
                        _callback();
                    });
                }
            }
        }
        checkDB(async function () {
            client.models.memberGreetings.findOne({
                "message_id": client.storage.messageCache['welcomeChannel'].greetings
            }, async (err, db) => {
                if (err) return console.error(err);
                if (!db) {
                    return console.error(`[ERROR] Serious error! Cannot find LATEST MEMBER LOG DATABASE after CREATION`);
                }
                let welcomeMsg = await client.channels.find(x => x.id == "564105510723256343").messages.fetch(client.storage.messageCache['welcomeChannel'].greetings);
                let embed;
                if (db.latest_memberAdd_id == null) {
                    embed = new client.modules.Discord.MessageEmbed()
                        .addField(`Latest Departure:`, `<@${db.latest_memberLeave[0].id}>\n${db.latest_memberLeave[0].tag}`, true)
                        .setColor(member.guild.member(client.user).displayHexColor)
                } else {
                    embed = new client.modules.Discord.MessageEmbed()
                        .addField(`Latest Member:`, `${member}\n${member.user.tag}`, true)
                        .addField(`Latest Departure:`, `<@${db.latest_memberLeave[0].id}>\n${db.latest_memberLeave[0].tag}`, true)
                        .setColor(member.guild.member(client.user).displayHexColor)
                }
                welcomeMsg.edit(embed);
            });
        })
    });
}