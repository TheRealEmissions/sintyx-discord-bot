module.exports = async (client, message) => {
    if (message.guild.id == '564101344756236347') {
        if (message.channel.type !== "text") return;
        if (message.author.id == client.user.id) return;
        if (message.author.bot) return;
        let channel = await client.channels.fetch(client.storage.messageCache['logChannel'].message_log_id);
        let embed = new client.modules.Discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`Message deleted!`)
            .setDescription(`User: ${message.author}`)
            .addField(`Message content:`, `[${message.content}](${message.url})`)
            .setTimestamp()
        channel.send(embed);
    }
}
