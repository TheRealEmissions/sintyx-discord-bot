module.exports = function logError(client, error, errorCode) {
    let Discord = require(`discord.js`);
    let guild = client.guilds.find(x => x.id == "567439300543905821");
    let channel = guild.channels.find(x => x.id == "581508137454927883");
    let embed = Discord.MessageEmbed()
        .setTitle(`**Error!** ${Boolean(errorCode) ? errorCode : ""}`)
        .setDescription("```" + client.functions.trim(error, 1000) + "```")
        .setColor(guild.member(client.user).displayHexColor)
    channel.send(embed);
}