module.exports = class urban {
    constructor() {
        this.name = 'urban',
            this.alias = [],
            this.usage = `-urban`
    }

    async run(client, message, args) {
        if (!args[1]) {
            message.delete();
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Urban Dictionary**`)
                .setDescription(`Please specify a word you would like to know the meaning of! For example: ` + "`" + `-urban mouse` + "`")
                .setColor(message.guild.member(client.user).displayHexColor)
            message.channel.send(embed).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            });
        }
        let word = args.slice(1);
        let query = client.modules.querystring.stringify({
            term: word.join(' ')
        });
        client.modules.request(`https://api.urbandictionary.com/v0/define?${query}`, (err, response, body) => {
            if (err) {
                console.error(err);
                client.functions.logError(client, err, `U003`)
                message.channel.send(client.functions.errorEmbed(`Urban Dictionary`, `U003`, message.guild.member(client.user).displayHexColor));
            }
            body = JSON.parse(body);
            let startTime = new Date().getTime();
            let startMsg = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Urban Dictionary**`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`Searching for the term/phrase ` + "`" + word + "`" + `... please wait.`)
            message.channel.send(startMsg).then(msg => {
                if (!body.list.length) {
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**Urban Dictionary**`)
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .setDescription(`We found no results for the term/phrase ` + "`" + word + "`" + `... *(Error U001)*`)
                    msg.edit(embed).then(msgg => {
                        setTimeout(() => {
                            message.delete();
                            msgg.delete();
                        }, 5000);
                    });
                } else {
                    let endTime = new Date().getTime();
                    let time = parseInt(endTime - startTime);
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**Urban Dictionary**`)
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .addField(`Definition of ${word.join(' ')}:`, `[${client.functions.trim(body.list[0].definition, (1000 - body.list[0].permalink.length - 1))}](${body.list[0].permalink})`)
                        .addField(`Thumbs Up`, body.list[0].thumbs_up + " " + client.storage.emojiCharacters.thumbs_up, true)
                        .addField(`Thumbs Down`, body.list[0].thumbs_down + " " + client.storage.emojiCharacters.thumbs_down, true)
                        .setFooter(`Processed your result in ${time}ms`)
                    msg.edit(embed).catch(err => {
                        console.error(err);
                        client.functions.logError(client, err, `U002`);
                        msg.edit(client.functions.errorEmbed(`Urban Dictionary`, `U002`, message.guild.member(client.user).displayHexColor));
                    });
                }
            });
        });
    }
}