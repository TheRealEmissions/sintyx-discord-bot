module.exports = (client, info) => {
    let startDate = new Date().getTime();
    let Discord = require(`discord.js`);
    let guild = client.guilds.find(x => x.id == "567439300543905821");
    let channel = guild.channels.find(x => x.id == "581508137454927883");
    let embed = Discord.MessageEmbed()
        .setTitle(`**Error!**`)
        .setDescription("```" + client.functions.trim(info, 1000) + "```")
        .setColor(guild.member(client.user).displayHexColor)
    channel.send(embed);
    new client.methods.log(client).debugStats(`warn`, client.user, new Date().getTime() - startDate);
}
