const {
    Multiple,
    Discord
} = require(`../modules`);
module.exports = class src extends Multiple(usernameColour, trelloCollector) {
    constructor(client) {
        super();
        this.processRoleCollector(client);
        this.trelloInit(client);
    }

}

class usernameColour {

    constructRemoveRoleEmbed(member, color) {
        return new Discord.MessageEmbed()
            .setDescription(`<@${member.id}> reset your username colour!`)
            .setColor(color)
    }

    constructAddRoleEmbed(member, role, color) {
        return new Discord.MessageEmbed()
            .setDescription(`<@${member.id}> altered your username colour to ${role.name}!`)
            .setColor(color)
    }

    processRole(message, user, role, roles, client) {
        if (message.guild.member(user).roles.find(x => x.id == role.id)) {
            this.checkRoles(message, user, roles);
            message.channel.send(this.constructRemoveRoleEmbed(user, message.guild.member(client.user).displayHexColor)).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        } else {
            this.checkRoles(message, user, roles);
            message.guild.member(user).roles.add([role.id]);
            message.channel.send(this.constructAddRoleEmbed(user, role, message.guild.member(client.user).displayHexColor)).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        }
    }

    checkRoles(message, user, roles) {
        return new Promise((resolve, reject) => {
            for (const count in roles) {
                if (message.guild.member(user).roles.get(roles[count].id)) {
                    message.guild.member(user).roles.remove([roles[count].id]);
                }
            }
            resolve();
        });
    }

    resolveReactionToRole(emoji, ec, roles) {
        if (emoji == ec['heart']) return roles[0];
        if (emoji == ec['yellow_heart']) return roles[1];
        if (emoji == ec['green_heart']) return roles[2];
        if (emoji == ec['blue_heart']) return roles[3];
        if (emoji == ec['purple_heart']) return roles[4];
        if (emoji == ec['black_heart']) return roles[5];
    }

    processRoleCollector(client) {
        let ec = client.storage.emojiCharacters;
        client.channels.get(client.storage.messageCache['usernameColor'].channel).messages.fetch(client.storage.messageCache['usernameColor'].id).then(msg => {
            let filter = (reaction, user) => ((reaction.emoji.name == ec['heart']) || (reaction.emoji.name == ec['yellow_heart']) || (reaction.emoji.name == ec['blue_heart']) || (reaction.emoji.name == ec['green_heart']) || (reaction.emoji.name == ec['purple_heart']) || (reaction.emoji.name == ec['black_heart'])) && user.id !== "567441952640073738";
            let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
            collector.on('collect', reaction => {
                reaction.users.remove(reaction.users.last());
                const roles = [msg.guild.roles.find(x => x.name == "Red"),
                    msg.guild.roles.find(x => x.name == "Yellow"),
                    msg.guild.roles.find(x => x.name == "Green"),
                    msg.guild.roles.find(x => x.name == "Blue"),
                    msg.guild.roles.find(x => x.name == "Purple"),
                    msg.guild.roles.find(x => x.name == "Black")
                ];
                let role = this.resolveReactionToRole(reaction.emoji.name, ec, roles);
                this.processRole(msg, reaction.users.last(), role, roles, client);
            });
        });
    }
}

class trelloCollector {
    constructor() {
        this.log = require(`../methods`).log;
        this.startTrelloCollector = require(`../methods`).startTrelloCollector;
    }

    async trelloInit(client) {
        this.startStageOne(client).catch(err => new this.log(client).error(err));
        this.startStageTwo(client).catch(err => new this.log(client).error(err));
        this.startStageThree(client).catch(err => new this.log(client).error(err));
    }

    startStageOne(client) {
        return new Promise((resolve, reject) => {
            client.models.trelloCards.find({
                "card_stage": 1
            }, async (err, db) => {
                if (err) return reject(err);
                if (!db) return resolve();
                for (const count in db) {
                    let msg = await client.channels.get(client.storage.messageCache['trelloChannels'].stageOne).messages.fetch(db[count].message_id),
                        filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['thumbs_up'] && user.id !== client.user.id,
                        collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    resolve();
                    collector.on('collect', reaction => {
                        collector.stop();
                        msg.delete();
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**${db[count].card_id}** - ${db[count].embed_title}`)
                            .setDescription(db[count].embed_desc)
                            .addField(`Task:`, db[count].embed_task)
                        client.channels.get(client.storage.messageCache['trelloChannels'].stageTwo).send(embed).then(message => {
                            message.react(client.storage.emojiCharacters['double_arrow_forward']);
                            client.models.trelloCards.findOne({
                                "_id": db[count]._id
                            }, (err, db) => {
                                if (err) return reject(err);
                                db.card_stage = 2;
                                db.message_id = message.id;
                                db.save((err) => {
                                    if (err) return reject(err);
                                    return new this.startTrelloCollector(client, 2, db.card_id);
                                });
                            });
                        });
                    });
                }
            });
        });
    }

    startStageTwo(client) {
        return new Promise(async(resolve, reject) => {
            client.models.trelloCards.find({
                "card_stage": 2
            }, (err, db) => {
                if (err) return reject(err);
                if (!db) return resolve();
                for (const count in db) {
                    let msg = await client.channels.get(client.storage.messageCache['trelloChannels'].stageTwo).messages.fetch(db[count].message_id)
                    let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['double_arrow_forward'] && user.id !== client.user.id;
                    let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    resolve();
                    collector.on('collect', reaction => {
                        collector.stop();
                        msg.delete();
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**${db[count].card_id}** - ${db[count].embed_title}`)
                            .setDescription(db[count].embed_desc)
                            .addField(`Task:`, db[count].embed_task)
                        client.channels.get(client.storage.messageCache['trelloChannels'].stageThree).send(embed).then(message => {
                            message.react(client.storage.emojiCharacters['white_check_mark']);
                            client.models.trelloCards.findOne({
                                "_id": db[count]._id
                            }, (err, db) => {
                                if (err) return reject(err);
                                db.card_stage = 3;
                                db.message_id = message.id;
                                db.save((err) => {
                                    if (err) return reject(err);
                                    return new this.startTrelloCollector(client, 3, db.card_id);
                                });
                            });
                        });
                    });
                }
            })
        });
    }

    startStageThree(client) {
        return new Promise(async(resolve, reject) => {
            client.models.trelloCards.find({
                "card_stage": 3
            }, (err, db) => {
                if (err) return reject(err);
                if (!db) return resolve();
                for (const count in db) {
                    let msg = await client.channels.get(client.storage.messageCache['trelloChannels'].stageThree).messages.fetch(db[count].message_id);
                    let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id !== client.user.id;
                    let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                    resolve();
                    collector.on('collect', reaction => {
                        collector.stop();
                        msg.delete();
                        let embed = new client.modules.Discord.MessageEmbed()
                            .setTitle(`**${db[count].card_id}** - ${db[count].embed_title}`)
                            .setDescription(db[count].embed_desc)
                            .addField(`Task:`, db[count].embed_task)
                        client.channels.get(client.storage.messageCache['trelloChannels'].stageFour).send(embed).then(message => {
                            client.models.trelloCards.findOne({
                                "_id": db[count]._id
                            }, (err, db) => {
                                if (err) return reject(err);
                                db.card_stage = 4;
                                db.message_id = message.id;
                                db.save((err) => reject(err));
                            });
                        });
                    });
                }
            });
        });
    }
}