module.exports = class log {
    constructor(client, guild = null) {
        this.client = client;
        this.guild = guild;
        this.channelID = client.storage.messageCache['logChannel'].id;
    }

    async send(message) {
        let channel = await this.client.channels.get(this.channelID);
        channel.send(message).catch(err => console.error(err));
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

    // logs

    async error(err) {
        console.error(err);
        return this.send(await this.constructEmbed(null, `**An error has occurred!** Please review the error below:`, await this.constructField(`Error:`, "```" + err + "```"), true))
    }

    async commandRan(author, command, message) {
        let executor = await this.constructField(`Executor:`, `<@${message.author.id}> *(${message.author.id})*`, true),
            cmd = await this.constructField(`Command:`, command, true),
            where = await this.constructField(`Where?`, `<#${message.channel.id}> [here](${message.url})`, true);
        let fields = [executor, cmd, where]
        return this.send(await this.constructEmbed(`**Command Ran**`, null, fields, true));
    }

    async levelUp(author, level) {
        return this.send(await this.constructEmbed(`**Level Up**`, null, [await this.constructField(`User:`, `<@${author.id}> *(${author.id})*`, true), await this.constructField(`Previous Level:`, level - 1, true), await this.constructField(`Current Level:`, level, true)], true));
    }
}
