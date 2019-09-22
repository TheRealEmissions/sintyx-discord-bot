module.exports = class log {
    constructor(client = null, guild = null) {
        this.client = client;
        this.guild = guild;
        this.channelID = client !== null ? client.storage.messageCache['logChannel'].id : null;
    }

    async send(message) {
        let channel = await this.client.channels.get(this.channelID);
        if (!channel) return;
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
        if (this.client.storage.auth['debug-mode'] == true) {
            console.log(`[DEBUG] ${message.author.tag} ran command ${command} in #${message.channel.name} (${message.channel.id})`);
        }
        let executor = await this.constructField(`Executor:`, `<@${message.author.id}> *(${message.author.id})*`, true),
            cmd = await this.constructField(`Command:`, command, true),
            where = await this.constructField(`Where?`, `<#${message.channel.id}> [here](${message.url})`, true);
        let fields = [executor, cmd, where]
        return this.send(await this.constructEmbed(`**Command Ran**`, null, fields, true));
    }

    async levelUp(author, level) {
        if (this.client.storage.auth['debug-mode'] == true) {
            console.debug(`[DEBUG] ${message.author.tag} levelled up to ${level}`);
        }
        return this.send(await this.constructEmbed(`**Level Up**`, null, [await this.constructField(`User:`, `<@${author.id}> *(${author.id})*`, true), await this.constructField(`Previous Level:`, level - 1, true), await this.constructField(`Current Level:`, level, true)], true));
    }

    async debug(message) {
        if (require(`../storage/auth`)['debug-mode'] == true) {
            console.debug(`-----[DEBUG]-----\n${message}\n-----------------`);
            if (this.client == null) return;
            return this.send(await this.constructEmbed(`[DEBUG MODE]`, null, await this.constructField(`Message:`, "```" + message + "```"), true));
        }
    }

    async debugStats(file, author, time) {
        if (require(`../storage/auth`)['debug-mode'] == true) {
            console.debug(`-----[DEBUG]-----\nStats from: ${file}.js\nInitiated by: ${author.tag} (${author.id})\nTime taken to run: ${time}ms\n-----------------`);
            if (this.client == null) return;
            return this.send(await this.constructEmbed(`[DEBUG MODE - STATS]`, null, [
                await this.constructField(`File:`, `${file}.js`, true),
                await this.constructField(`Initiated by:`, `${author} (${author.id})`, true),
                await this.constructField(`Time taken to run:`, `${time}ms`, true)
            ], true));
        }
    }
}
