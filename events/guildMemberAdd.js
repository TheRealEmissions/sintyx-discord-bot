module.exports = (client, member) => {
    new memberlog(client, member).run();
    new checkBlacklisted(client, member).run();
}

class memberlog {
    constructor(client, member) {
        this.client = client;
        this.member = member;
    }

    async run() {
        let channel = await this.client.channels.fetch(this.client.storage.messageCache['logChannel'].member_log_id);
        let embed = new this.client.modules.Discord.MessageEmbed()
            .setColor(member.guild.me.displayHexColor)
            .setTitle(`Member joined!`)
            .setThumbnail(member.avatarURL())
            .setDescription(`User: ${member}`)
            .setTimestamp()
        channel.send(embed);
    }
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
                if (err) return reject(err);
                if (!db) return resolve(false);
                if (!db.blacklisted) {
                    db.blacklisted = false;
                    db.save((err) => {
                        if (err) return console.error(err);
                        return resolve(false);
                    });
                }
                if (db.blacklisted == true) return resolve(true);
                else return resolve(false);
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
