module.exports = class app {
    constructor() {
        this.name = 'applications',
            this.alias = ["apps"],
            this.usage = '-applications [ID]',
            this.category = 'user',
            this.description = 'View a list of all of your applications or view a specific application\'s information.'
    }

    replaceMonth(term) {
        let o = {
            0: "Jan.",
            1: "Feb.",
            2: "Mar.",
            3: "Apr.",
            4: "May",
            5: "Jun.",
            6: "Jul.",
            7: "Aug.",
            8: "Sep.",
            9: "Oct.",
            10: "Nov.",
            11: "Dec."
        }
        return o[term];
    }

    replaceDay(term) {
        let o = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        }
        return o[term];
    }

    replaceTime(term) {
        if (term.toString().length == 1) {
            return `0${term}`;
        } else return term;
    }

    async run(client, message, args) {
        if (!args[1]) {
            client.models.userProfiles.find({
                "user_id": message.author.id
            }, (err, docs) => {
                if (err) return new client.methods.log(client).error(err);
                if (!docs[0].application_log) return message.channel.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.me.displayHexColor)
                    .setDescription(`You haven't opened any applications before.`)
                );
                docs[0].application_log = docs[0].application_log.sort((a, b) => {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });
                let embed = {
                    embed: {
                        color: message.guild.me.displayHexColor,
                        title: `Application History for **${message.author.tag}**:`,
                        fields: [{
                            name: `Reference IDs`,
                            value: docs[0].application_log.map(r => `${r.reference_id}`, true).join(`\n`),
                            inline: true
                        }, {
                            name: `Date`,
                            value: docs[0].application_log.map(r => `${this.replaceDay(new Date(r.timestamp).getUTCDay())} ${new Date(r.timestamp).getUTCDate()} ${this.replaceMonth(new Date(r.timestamp).getUTCMonth())} ${new Date(r.timestamp).getUTCFullYear()} at ${this.replaceTime(new Date(r.timestamp).getUTCHours())}:${this.replaceTime(new Date(r.timestamp).getUTCMinutes())}`).join(`\n`),
                            inline: true
                        }]
                    }
                }
                message.channel.send(embed);
            });
        } else if (args[1]) {
            client.models.staffApplications.findOne({
                "reference_id": args[1]
            }, async (err, db) => {
                if (err) return new client.methods.log(client).error(err);
                if (!db) return message.channel.send(`:x: This application ID does not exist!`);
                if ((db.user_id !== message.author.id) || (!message.member.roles.find(x => x.name == "Management"))) return;
                const user = await client.users.fetch(db.user_id);
                message.channel.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.me.displayHexColor)
                    .setTitle(`Application Information - **${args[1]}**`)
                    .addField(`Opened by:`, `${user}`, true)
                    .addField(`Date opened:`, `${this.replaceDay(new Date(db.timestamp).getUTCDay())} ${new Date(db.timestamp).getUTCDate()} ${this.replaceMonth(new Date(db.timestamp).getUTCMonth())} ${new Date(db.timestamp).getUTCFullYear()} at ${this.replaceTime(new Date(db.timestamp).getUTCHours())}:${this.replaceTime(new Date(db.timestamp).getUTCMinutes())}`, true)
                    .addField(`Status:`, db.status, true)
                );
                let txt = [];
                for (const response in db.responses) {
                    txt.push(`Q ---> ${client.storage.appQs[response]}`);
                    txt.push(`A > ${db.responses[response].content}`);
                }
                await client.modules.fs.appendFileSync(`./commands/${db.reference_id}.json`, JSON.stringify(txt.join(`
                `)));
                message.channel.send({
                    files: [`./commands/${db.reference_id}.json`]
                }).then(() => {
                    client.modules.fs.unlink(`./commands/${db.reference_id}.json`, (err) => new client.methods.log(client).error(err));
                });
            });
        }
    }
}
