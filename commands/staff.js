class profile {
    constructor() {};
}

class app {
    constructor() {};
    updateStatus(client, id, status) {
        return new Promise((resolve, reject) => {
            client.models.staffApplications.findOne({
                "reference_id": id
            }, (err, db) => {
                if (err) return reject(err);
                if (!db) return reject('Application ID could not be found in the database.');
                status = status.toUpperCase();
                db.status = status;
                db.save((err) => {
                    if (err) return reject(err);
                    else return resolve();
                });
            });
        });
    }

    getRole(client, message) {
        return new Promise((resolve, reject) => {
            message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(`Please ping the role or type the ID of the role you wish to award the applicant.`)
            ).then(msg => {
                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
                collector.on('collect', role => {
                    role.delete();
                    let r = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(`${role}`);
                    if (r) {
                        collector.stop();
                        msg.delete();
                        return resolve(r);
                    }
                });
            }).catch(err => reject(err));
        });
    }

    accept(client, message, id) {
        return new Promise(async (resolve, reject) => {
            this.updateStatus(client, id, 'ACCEPTED').catch(err => reject(err));
            const role = await this.getRole(client, message).catch(err => reject(err));
            client.models.staffApplications.findOne({
                "reference_id": id
            }, (err, db) => {
                if (err) return reject(err);
                db.status = 'ACCEPTED';
                let newdb = new client.models.staffProfiles({
                    user_id: db.user_id,
                    role_id: role.id
                });
                newdb.save((err) => {
                    if (err) return reject(err);
                    else client.models.staffProfiles.findOne({
                        "user_id": db.user_id
                    }, (err, datab) => {
                        if (err) return reject(err);
                        datab.position_log.push({
                            type: "ACCEPTED",
                            timestamp: new Date(),
                            role_id: role.id
                        });
                        datab.save((err) => {
                            if (err) return reject(err);
                        });
                    });
                });
                db.save((err) => {
                    if (err) return reject(err);
                });
                message.guild.members.get(db.user_id).roles.add([role.id]);
                message.channel.send(`**:wave: Hey <@${message.guild.members.get(db.user_id).user.id}>!** You have been accepted as a staff member for Sintyx! You have been awarded ${role}.`);
                resolve();
            });
        });
    }

    collectDenyReason(client, message) {
        return new Promise(async (resolve, reject) => {
            const msg = await message.channel.send(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(`What is the reason of rejection for this applicant?`)
            ).catch(err => reject(err));
            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {});
            collector.on('collect', r => {
                r.delete().catch(err => reject(err));
                msg.delete().catch(err => reject(err));
                return resolve(r);
            });
        });
    }

    deny(client, message, id) {
        return new Promise(async (resolve, reject) => {
            this.updateStatus(client, id, 'DENIED').catch(err => reject(err));
            client.models.staffApplications.findOne({
                "reference_id": id
            }, async (err, db) => {
                if (err) return reject(err);
                const user = await message.guild.members.get(db.user_id).user;
                const reason = await this.collectDenyReason(client, message);
                message.channel.send(`**:wave: Hey ${user}!** Unfortunately, we have decided to reject your application. This is the reason we have provided:\n\`\`\`${reason}\`\`\``)
                return resolve();
            });
        });
    }
}

const {
    Multiple
} = require(`../modules`);
module.exports = class staff extends Multiple(profile, app) {
    constructor() {
        super();
        this.name = 'staff',
            this.alias = [],
            this.usage = '-staff <options>',
            this.category = 'administration',
            this.description = 'Run staff based commands such as profile viewing'
    }

    async run(client, message, args) {
        if (args[1].toLowerCase() == "accept") {
            if (!args[2]) return message.channel.send(`You must specify an ID to accept!`).then((msg) => setTimeout(() => {
                message.delete();
                msg.delete();
            }, 3000));
            this.accept(client, message, args[2]);
        }
        if (args[1].toLowerCase() == "deny") {
            if (!args[2]) return message.channel.send(`You must specify an ID to deny!`).then((msg) => setTimeout(() => {
                message.delete();
                msg.delete();
            }, 3000));
            this.deny(client, message, args[2]);
        }
    }
}
