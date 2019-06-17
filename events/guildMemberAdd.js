module.exports = (client, member) => {
    client.models.memberGreetings.findOne({
        "message_id": client.storage.messageCache['welcomeChannel'].greetings
    }, async (err, db) => {
        if (err) return console.error(err);

        function checkDB(_callback) {
            if (!db) {
                let newdb = new client.models.memberGreetings({
                    message_id: client.storage.messageCache['welcomeChannel'].greetings,
                    latest_memberAdd_id: member.id,
                    latest_memberLeave: []
                });
                newdb.save(async (err) => {
                    if (err) console.error(err);
                    if (!err) _callback();
                });
            } else {
                db.latest_memberAdd_id = member.id;
                db.save((err) => {
                    if (err) console.error(err);
                    if (!err) _callback();
                });
            }
        }
        checkDB(async function () {
            client.models.memberGreetings.findOne({
                "message_id": client.storage.messageCache['welcomeChannel'].greetings
            }, async (err, db) => {
                if (err) return console.error(err);
                if (!db) {
                    return console.error(`[ERROR] Serious error! Database cannot be found for LATEST MEMBER LOG after CREATION`)
                }
                let welcomeMsg = await client.channels.find(x => x.id == "590285429404860443").messages.fetch(client.storage.messageCache['welcomeChannel'].greetings)
                let embed;
                if ((!db.latest_memberLeave[0]) || (typeof db.latest_memberLeave == (null || 'null'))) {
                    embed = new client.modules.Discord.MessageEmbed()
                        .addField(`Latest Member:`, `${member}\n${member.user.tag}`, true)
                        .setColor(member.guild.member(client.user).displayHexColor)
                } else {
                    embed = new client.modules.Discord.MessageEmbed()
                        .addField(`Latest Member:`, `${member}\n${member.user.tag}`, true)
                        .addField(`Latest Departure:`, `<@${db.latest_memberLeave[0].id}>\n${db.latest_memberLeave[0].tag}`, true)
                        .setColor(member.guild.member(client.user).displayHexColor)
                }
                welcomeMsg.edit(embed);
            });
        });
    });
}