module.exports = class log {
    constructor(client, guild = null) {
        this.client = client;
        this.guild = guild;
        this.channelID = client.storage.messageCache['logChannel'].id;
    }

    async send(message) {
        let channel = await this.client.channels.get(this.channelID);
        channel.send(message);
    }

    constructField(name, value, inline = false) {
        return new Promise((resolve, reject) => {
            return resolve({
                name: name,
                value: value,
                inline: inline,
            });
        });
    }

    constructEmbed(title, description, fields = {}, timestamp = false) {
        return new Promise((resolve, reject) => {
            let embed = {
                embed: {
                    color: this.guild !== null ? this.guild.member(this.client.user).displayHexColor : null,
                    title: title == null ? null : title,
                    description: description == null ? null : description,
                    fields: fields == {} ? [] : (fields instanceof Array ? fields : [fields]),
                    timestamp: timestamp == true ? new Date() : null
                }
            }
            return resolve(embed);
        });
    }

    async error(err) {
        console.error(err);
        return this.send(await this.constructEmbed(null, `**An error has occurred!** Please review the error below:`, await this.constructField(`Error:`, "```" + err + "```"), true))
    }
}