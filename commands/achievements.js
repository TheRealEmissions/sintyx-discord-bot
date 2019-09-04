module.exports = class ach {
    constructor() {
        this.name = 'achievements',
            this.alias = ['ach', 'achievement', 'achs'],
            this.usage = '-achievements',
            this.category = 'user',
            this.description = 'View your locked and unlocked achievements!'
    }

    replaceMonth(date) {
        let ra;
        switch (date) {
            case 0:
                ra = "Jan.";
                break;
            case 1:
                ra = "Feb.";
                break;
            case 2:
                ra = "Mar.";
                break;
            case 3:
                ra = "Apr.";
                break;
            case 4:
                ra = "May";
                break;
            case 5:
                ra = "Jun.";
                break;
            case 6:
                ra = "Jul.";
                break;
            case 7:
                ra = "Aug.";
                break;
            case 8:
                ra = "Sep.";
                break;
            case 9:
                ra = "Oct.";
                break;
            case 10:
                ra = "Nov.";
                break;
            case 11:
                ra = "Dec.";
                break;
        }
        return ra;
    }

    replaceDay(date) {
        let ra;
        switch (date) {
            case 0:
                ra = "Sun.";
                break;
            case 1:
                ra = "Mon.";
                break;
            case 2:
                ra = "Tue.";
                break;
            case 3:
                ra = "Wed.";
                break;
            case 4:
                ra = "Thu.";
                break;
            case 5:
                ra = "Fri.";
                break;
            case 6:
                ra = "Sat.";
                break;
        }
        return ra;
    }

    replaceTime(date) {
        let ra;
        if (date.toString().length == 1) {
            ra = `0${date}`;
        } else {
            ra = date;
        }
        return ra;
    }

    genUnlockedEmbed(client, message) {
        return new Promise((resolve, reject) => {
            client.models.achievements.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return reject(err);
                let achs = [],
                    timestamps = [],
                    tasks = []
                for (const ach of client.storage.achievements) {
                    for (const achievement of ach.data) {
                        if (db.achievements.find(x => x.name == achievement.name).completed == false) continue;
                        achs.push(achievement.name);
                        timestamps.push(db.achievements.find(x => x.name == achievement.name).timestamp);
                        tasks.push(achievement.description);
                    }
                }
                let embed = {
                    embed: {
                        color: message.guild.me.displayHexColor,
                        title: `Unlocked Achievements for **${message.author.tag}**:`,
                        description: `To view more information about an achievement, type \`-ach <achievement>\`.`,
                        fields: [{
                            name: 'Achievement:',
                            value: achs.map(a => `${a}`).join(`\n`),
                            inline: true
                        }, {
                            name: 'Task:',
                            value: tasks.map(t => `${t}`).join(`\n`),
                            inline: true
                        }, {
                            name: 'Completed on:',
                            value: timestamps.map(t => `${this.replaceDay(new Date(t).getUTCDay())} ${new Date(t).getUTCDate()} ${this.replaceMonth(new Date(t).getUTCMonth())} ${new Date(t).getUTCFullYear()} at ${this.replaceTime(new Date(t).getUTCHours())}:${this.replaceTime(new Date(t).getUTCMinutes())}`).join(`\n`),
                            inline: true
                        }]
                    }
                }
                return resolve(embed);
            });
        });
    }

    genLockedEmbed(client, message) {
        return new Promise((resolve, reject) => {
            client.models.achievements.findOne({
                "user_id": message.author.id
            }, (err, db) => {
                if (err) return reject(err);
                let values = [];
                for (const ach of client.storage.achievements) {
                    for (const achievement of ach.data) {
                        if (db.achievements.find(x => x.name == achievement.name).completed == true) continue;
                        values.push({
                            name: achievement.name,
                            task: achievement.description
                        });
                    }
                }
                let embed = {
                    embed: {
                        color: message.guild.me.displayHexColor,
                        title: `Locked Achievements for **${message.author.tag}**:`,
                        description: `To view more information about an achievement, type \`-ach <achievement>\`.`,
                        fields: [{
                            name: 'Achievement:',
                            value: values.map(v => `${v.name}`).join(`\n`),
                            inline: true
                        }, {
                            name: 'Task:',
                            value: values.map(v => `${v.task}`).join(`\n`),
                            inline: true
                        }]
                    }
                }
                return resolve(embed);
            });
        });
    }

    async run(client, message, args) {
        message.channel.send(new client.modules.Discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .addField(`:one: Unlocked Achievements`, `** **`)
            .addField(`:two: Locked Achievements`, `** **`)
        ).then(msg => {
            msg.react(client.storage.emojiCharacters[1]).then(() => msg.react(client.storage.emojiCharacters[2]).then(() => msg.react(client.storage.emojiCharacters['x'])));
            let collector = new client.modules.Discord.ReactionCollector(msg, (reaction, user) => ((reaction.emoji.name == client.storage.emojiCharacters[1]) || (reaction.emoji.name == client.storage.emojiCharacters[2]) || (reaction.emoji.name == client.storage.emojiCharacters['x'])) && user.id == message.author.id, {});
            collector.on('collect', async reaction => {
                switch (reaction.emoji.name) {
                    case client.storage.emojiCharacters[1]:
                        reaction.users.remove(reaction.users.last());
                        msg.edit(await this.genUnlockedEmbed(client, message).catch(err => new client.methods.log(client).error(err)));
                        break;
                    case client.storage.emojiCharacters[2]:
                        reaction.users.remove(reaction.users.last());
                        msg.edit(await this.genLockedEmbed(client, message).catch(err => new client.methods.log(client).error(err)));
                        break;
                    default:
                        collector.stop();
                        message.delete();
                        msg.delete();
                        break;
                }
            });
        });
    }
}
