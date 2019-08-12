module.exports = (client, member) => {
    new welcomeMessage(client, member).run();
}

class checkBlacklisted {
    constructor(client, member) {
        this.client = client;
        this.member = member;
    }

    checkDB() {
        return new Promise((resolve, reject) => {
            this.client.models.userProfiles.findOne({
                "user_id": this.member.user.id
            }, (err, db) => {
                if (err) reject(err);
                if (!db) resolve(false);
                if (!db.blacklisted) {
                    db.blacklisted = false;
                    db.save((err) => {
                        if (err) return console.error(err);
                        return resolve(false);
                    });
                }
                if (db.blacklisted == true) return resolve(true); else return resolve(false);
            });
        });
    }

    run() {
        this.checkDB().then(boolean => {
            if (boolean == true) {
                this.member.roles.add([this.member.roles.find(x => x.name == "Blacklisted").id]);
            } else return;
        });
    }
}

class welcomeMessage {
    constructor(client, member) {
        this.client = client;
        this.member = member;
    }

    checkDB() {
        return new Promise((resolve, reject) => {
            this.client.models.memberGreetings.findOne({
                "message_id": this.client.storage.messageCache['welcomeChannel'].greetings
            }, async (err, db) => {
                if (err) return reject(err);
                if (!db) {
                    let newdb = new this.client.models.memberGreetings({
                        message_id: this.client.storage.messageCache['welcomeChannel'].greetings,
                        latest_memberAdd_id: this.member.id,
                        latest_memberLeave: []
                    });
                    newdb.save((err) => {
                        if (err) return reject(err);
                        return resolve();
                    });
                }
            });
        });
    }

    async run() {
        await this.checkDB().catch(err => console.error(err));
        this.client.models.memberGreetings.findOne({
            "message_id": this.client.storage.messageCache['welcomeChannel'].greetings
        }, async (err, db) => {
            if (err) return console.error(err);
            if (!db) return console.error(`[ERROR] Database cannot be found for LATEST MEMBER LOG after CREATION`)
            let welcomeMsg = await this.client.channels.find(x => x.id == "590285429404860443").messages.fetch(this.client.storage.messageCache['welcomeChannel'].greetings);
            let embed;
            if ((!db.latest_memberLeave[0]) || (typeof db.latest_memberLeave == (null || 'null'))) {
                embed = new this.client.modules.Discord.MessageEmbed()
                    .setColor(this.member.guild.member(this.client.user).displayHexColor)
                    .addField(`Latest Member:`, `${this.member}\n${this.member.user.tag}`, true)
            } else {
                embed = new this.client.modules.Discord.MessageEmbed()
                    .setColor(this.member.guild.member(this.client.user).displayHexColor)
                    .addField(`Latest Member`, `${this.member}\n${this.member.user.tag}`, true)
                    .addField(`Latest Departure:`, `<@${db.latest_memberLeave[0].id}>\n${db.latest_memberLeave[0].tag}`, true)
            }
            welcomeMsg.edit(embed);
        });
    }
}