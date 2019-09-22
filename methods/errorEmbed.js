const client = require(`../app`);
module.exports = class errorEmbed {
    constructor() {
        new client.methods.log(client).debug(`Method ran: errorEmbed.js`);
        this.Discord = require(`../modules`).Discord;
    }

    process(title, error, embedColor) {
        return new this.Discord.MessageEmbed()
            .setTitle(`**${title}** - Error`)
            .setColor(embedColor)
            .setDescription(`Unfortunately, we could not process your command due to an error. Please display the error code to a staff member.`)
            .addField(`Error Code`, `\`\`\`${error}\`\`\``)
            .setTimestamp();
    }
}
