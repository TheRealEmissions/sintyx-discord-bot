let Discord = require(`discord.js`)
module.exports = function errorEmbed(title, error) {
    let embed = new Discord.MessageEmbed()
        .setTitle(`**${title}** - Error`)
        .setDescription(`Unfortunately, we could not process your command due to an error. Please display the error code to a staff member.`)
        .addField(`Error Code`, `${error}`)
    return embed;
}