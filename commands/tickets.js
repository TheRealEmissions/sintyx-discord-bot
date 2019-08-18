module.exports = class tickets {
    constructor() {
        this.name = 'tickets',
            this.usage = '-tickets',
            this.alias = ["tickethistory", "thistory"],
            this.category = 'user',
            this.description = 'Shows a list of your previous Support Ticket reference IDs'
    }

    async run(client, message, args) {
        if (!args[1]) {
            client.models.userProfiles.find({
                "user_id": message.author.id
            }).lean().exec(async(err, docs) => {
                if (err) return new client.methods.log(client, message.guild).error(err);

                function replaceMonth(term) {
                    if (term === 0) return "Jan."
                    if (term === 1) return "Feb."
                    if (term === 2) return "Mar."
                    if (term === 3) return "Apr."
                    if (term === 4) return "Mar."
                    if (term === 5) return "Jun."
                    if (term === 6) return "Jul."
                    if (term === 7) return "Aug."
                    if (term === 8) return "Sep."
                    if (term === 9) return "Oct."
                    if (term === 10) return "Nov."
                    if (term === 11) return "Dec."
                }

                function replaceDay(term) {
                    if (term === 0) return "Sunday"
                    if (term === 1) return "Monday"
                    if (term === 2) return "Tuesday"
                    if (term === 3) return "Wednesday"
                    if (term === 4) return "Thursday"
                    if (term === 5) return "Friday"
                    if (term === 6) return "Saturday"
                }

                function replaceTime(term) {
                    if (term.toString().length == 1) {
                        return `0${term}`
                    } else {
                        return term;
                    }
                }
                if (docs[0].ticket_history) {
                    docs[0].ticket_history = docs[0].ticket_history.sort((a, b) => {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`Ticket History for **${message.author.tag}**:`)
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .addField(`Tickets`, docs[0].ticket_history.map(r => `${r.reference_id}`), true)
                        .addField(`Date`, docs[0].ticket_history.map(r => `${replaceDay(new Date(r.timestamp).getUTCDay())} ${new Date(r.timestamp).getUTCDate()} ${replaceMonth(new Date(r.timestamp).getUTCMonth())} ${new Date(r.timestamp).getUTCFullYear()} at ${replaceTime(new Date(r.timestamp).getUTCHours())}:${replaceTime(new Date(r.timestamp).getUTCMinutes())}`), true)
                    message.channel.send(embed);
                } else {
                    message.channel.send(`You have not opened any tickets! Please try opening a ticket before running this command.`)
                }
            });
        } else {
            if (message.member.roles.find(x => x.name == "Management")) {
                let user = Boolean(message.mentions.users.first()) ? message.mentions.users.first() : await Promise.resolve(client.users.fetch(args[1]));
                if (user) {
                    client.models.userProfiles.find({
                        "user_id": user.id
                    }).lean().exec((err, docs) => {
                        if (err) return new client.methods.log(client, message.guild).error(err);
                        if (!docs[0].ticket_history) return;

                        function replaceMonth(term) {
                            if (term === 0) return "Jan."
                            if (term === 1) return "Feb."
                            if (term === 2) return "Mar."
                            if (term === 3) return "Apr."
                            if (term === 4) return "Mar."
                            if (term === 5) return "Jun."
                            if (term === 6) return "Jul."
                            if (term === 7) return "Aug."
                            if (term === 8) return "Sep."
                            if (term === 9) return "Oct."
                            if (term === 10) return "Nov."
                            if (term === 11) return "Dec."
                        }

                        function replaceDay(term) {
                            if (term === 0) return "Sunday"
                            if (term === 1) return "Monday"
                            if (term === 2) return "Tuesday"
                            if (term === 3) return "Wednesday"
                            if (term === 4) return "Thursday"
                            if (term === 5) return "Friday"
                            if (term === 6) return "Saturday"
                        }

                        function replaceTime(term) {
                            if (term.toString().length == 1) {
                                return `0${term}`
                            } else {
                                return term;
                            }
                        }
                        if ((docs[0].ticket_history.length > 0) || (!docs[0].ticket_history)) {
                            docs[0].ticket_history = docs[0].ticket_history.sort((a, b) => {
                                return new Date(b.timestamp) - new Date(a.timestamp);
                            });
                            let embed = new client.modules.Discord.MessageEmbed()
                                .setTitle(`Ticket History for **${user.tag}**:`)
                                .setColor(message.guild.member(client.user).displayHexColor)
                                .addField(`Tickets`, docs[0].ticket_history.map(r => `${r.reference_id}`), true)
                                .addField(`Date`, docs[0].ticket_history.map(r => `${replaceDay(new Date(r.timestamp).getUTCDay())} ${new Date(r.timestamp).getUTCDate()} ${replaceMonth(new Date(r.timestamp).getUTCMonth())} ${new Date(r.timestamp).getUTCFullYear()} at ${replaceTime(new Date(r.timestamp).getUTCHours())}:${replaceTime(new Date(r.timestamp).getUTCMinutes())}`), true)
                            message.channel.send(embed);
                        } else {
                            message.channel.send(`This user has not opened any tickets.`)
                        }
                    });
                } else {
                    message.channel.send(`Unfortunately, I couldn't find that user. Please either ping that user or type their ID after the command.`)
                }
            }
        }
    }
}