module.exports = async (client, member) => {
    let startDate = new Date().getTime();
    let channel = await this.client.channels.fetch(this.client.storage.messageCache['logChannel'].member_log_id);
    let embed = new this.client.modules.Discord.MessageEmbed()
        .setColor(member.guild.me.displayHexColor)
        .setThumbnail(member.avatarURL())
        .setTitle(`Member left!`)
        .setDescription(`User: ${member} (${member.tag})`)
        .setTimestamp()
    channel.send(embed);
    new client.methods.log(client).debugStats(`guildMemberRemove`, member.user, new Date().getTime() - startDate);
}
