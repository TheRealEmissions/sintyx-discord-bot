module.exports = class error {
    constructor(title, error, embedColor) {
        this.process(title, error, embedColor);
        this.Discord = require(`discord.js`);
    }

    process(title, error, embedColor) {
        return new this.Discord.MessageEmbed()
            .setTitle(`**${title} - Error`)
            .setColor(embedColor)
            .setDescription(`Unfortunately, we could not process your command due to an error. Please display the error code to a staff member.`)
            .addField(`Error Code`, `\`\`\`${error}\`\`\``)
            .setTimestamp();
    }
}