module.exports = (client, oldMessage, newMessage) => {
    if (newMessage.channel.type !== "text") return;
    if (newMessage.author.id == client.user.id) return;
    if (newMessage.author.bot) return;
    if (newMessage.channel.parentID == "587325973201027080") {
        client.models.supportTickets.findOne({
            "channel_id": newMessage.channel.id,
            "user_id": newMessage.author.id
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return console.log(`[ERROR] User typing in channel found in SUPPORT TICKETS but no SUPPORT TICKET DATABASE ENTRY can be found! (${oldMessage.channel.name} ${oldMessage.channel.id})`)
            }
            let array = {
                number: Boolean(db.logs.find(x => x.message_id == newMessage.id).edits) ? db.logs.find(x => x.message_id == newMessage.id).edits.length + 1 : 1,
                timestamp: new Date(),
                content: newMessage.content
            }
            db.logs.find(x => x.message_id == oldMessage.id).edits.push(array);
            db.save((err) => console.error(err));
        });
    }
}