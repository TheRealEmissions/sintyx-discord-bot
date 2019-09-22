module.exports = class setslogan {
    constructor() {
        this.name = 'setslogan',
            this.alias = [],
            this.usage = '-setslogan <slogan>',
            this.category = 'user',
            this.description = 'Set your personal slogan for your profile!'
    }

    checkFilter(term, filter, message, client) {
        return new Promise((resolve, reject) => {
            term = term.toLowerCase().split(" ").join("");
            for (const word of filter) {
                if (term.includes(word)) {
                    message.channel.send(`:x: Your slogan cannot contain banned terms! Found term: \`${word}\``).then(msg => {
                        setTimeout(() => msg.delete(), 3000);
                    });
                    resolve(false);
                    break;
                } else continue;
            }
            return resolve(true);
        });
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        message.delete();
        if (!args[1]) return;
        let slogan = client.modules.Discord.escapeMarkdown(message.content.slice(args[0].length + 1));
        if (slogan.length > 150) return message.channel.send(`:x: Your slogan must be 150 characters or below!`).then((msg) => setTimeout(() => msg.delete(), 3000));
        let filter = ["http://", "https://", ".com", ".org", ".net", ".us", ".edu", ".info", ".in", ".it", ".biz", ".co", ".one", ".name", ".uk", ".gov", ".mil", ".is", ".eu", ".de", ".pro", ".xyz", ".example", ".fr", ".aero", ".mx", ".mobi", ".au", ".io", ".ca", ".arpa", ".ru", ".es", ".tel", ".jobs", ".jp", ".asia", ".museum", ".tv", ".nl", ".ly", ".cn", ".top", ".int", ".ch", ".se", ".ws", ".eg", ".wiki", ".br", ".th", ".tk", ".cc", ".site", "www.", "porn", ".app", ".online", ".space", ".house", ".store", ".tech", ".club", "hypixel", "mineplex", "fragglecraft", "cosmicprisons", "cosmicprison", ".gg", ".blog", ".bz", ".ly", ".club", ".rewards", ".me", "arkhamnetwork", "hypxl", ".win", "hypixl", "hypxel", "hipixel", "nigger", "nigga", ".link", ".pw"];
        let check = await this.checkFilter(slogan, filter, message, client);
        if (check == false) return;
        slogan = slogan.replace(/(\r\n|\n|\r)/gm, " ");
        client.models.userProfiles.findOne({
            "user_id": message.author.id
        }, (err, db) => {
            if (err) return new client.methods.log(client).error(err);
            db.user_slogan = slogan;
            db.save((err) => {
                if (err) return new client.methods.log(client).error(err);
                else {
                    return message.channel.send(`:white_check_mark: Updated your slogan to: \`${slogan}\``);
                }
            });
        });
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
