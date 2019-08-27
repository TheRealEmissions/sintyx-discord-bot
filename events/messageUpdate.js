module.exports = (client, oldMessage, newMessage) => {
    if (newMessage.channel.type !== "text") return;
    if (newMessage.author.id == client.user.id) return;
    if (newMessage.author.bot) return;
    if (newMessage.content.startsWith(client.commandHandler.prefix[0])) return;
    if (newMessage.channel.parent.name == "Support Tickets") {
        client.models.supportTickets.findOne({
            "channel_id": newMessage.channel.id,
        }, (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return console.log(`[ERROR] User typing in channel found in SUPPORT TICKETS but no SUPPORT TICKET DATABASE ENTRY can be found! (${newMessage.channel.name} ${newMessage.channel.id})`)
            }
            let array = {
                number: Boolean(db.logs.find(x => x.message_id == newMessage.id).edits) ? db.logs.find(x => x.message_id == newMessage.id).edits.length + 1 : 1,
                timestamp: new Date().getTime(),
                content: newMessage.content
            }
            db.logs.find(x => x.message_id == newMessage.id).edits.push(array);
            db.save((err) => console.error(err));
        });
    }
}
