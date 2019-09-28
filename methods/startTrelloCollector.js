module.exports = class trello {
    constructor(client, stage, card_id) {
        new client.methods.log(client).debug(`Method ran: startTrelloCollector.js`);
        this.log = require(`../methods`).log;
        this.init(client, stage, card_id);
    }

    init(client, stage, card_id) {
        return {
            1: this.stageOne(client, card_id).catch(err => new this.log(client).error(err)),
            2: this.stageTwo(client, card_id).catch(err => new this.log(client).error(err)),
            3: this.stageThree(client, card_id).catch(err => new this.log(client).error(err))
        } [stage];
    }

    stageOne(client, card_id) {
        return new Promise((resolve, reject) => {
            client.models.trelloCards.findOne({
                "card_stage": 1,
                "card_id": card_id
            }, async (err, db) => {
                if (err) return reject(err);
                if (!db) return reject(`Could not initiate TRELLO COLLECTOR, no DATABASE ENTRY found`);
                let msg = await client.channels.get(client.storage.messageCache['trelloChannels'].stageOne).messages.fetch(db.message_id);
                let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['thumbs_up'] && user.id !== client.user.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', reaction => {
                    collector.stop();
                    msg.delete();
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                        .setDescription(db.embed_desc)
                        .addField(`Task:`, db.embed_task)
                    client.channels.get(client.storage.messageCache['trelloChannels'].stageTwo).send(embed).then(message => {
                        db.card_stage = 2;
                        db.message_id = message.id;
                        db.save((err) => {
                            if (err) return reject(err);
                            message.react(client.storage.emojiCharacters['double_arrow_forward']);
                            return this.stageTwo(client, card_id);
                        });
                    });
                });
            });
        });
    }

    stageTwo(client, card_id) {
        return new Promise((resolve, reject) => {
            client.models.trelloCards.findOne({
                "card_stage": 2,
                "card_id": card_id
            }, async (err, db) => {
                if (err) return reject(err);
                if (!db) return reject(`Could not initiate TRELLO COLLECTOR, no DATABASE ENTRY found`);
                let msg = await client.channels.get(client.storage.messageCache['trelloChannels'].stageTwo).messages.fetch(db.message_id);
                let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['double_arrow_forward'] && user.id !== client.user.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', reaction => {
                    collector.stop();
                    msg.delete();
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                        .setDescription(db.embed_desc)
                        .addField(`Task:`, db.embed_task)
                    client.channels.get(client.storage.messageCache['trelloChannels'].stageThree).send(embed).then(message => {
                        db.card_stage = 3;
                        db.message_id = message.id;
                        db.save((err) => {
                            if (err) return reject(err);
                            message.react(client.storage.emojiCharacters['white_check_mark']);
                            return this.stageThree(client, card_id);
                        });
                    });
                });
            });
        });
    }

    stageThree(client, card_id) {
        return new Promise((resolve, reject) => {
            client.models.trelloCards.findOne({
                "card_stage": 3,
                "card_id": card_id
            }, async (err, db) => {
                if (err) return reject(err);
                if (!db) return reject(`Could not initiate TRELLO COLLECTOR, no DATABASE ENTRY found`);
                let msg = await client.channels.get(client.storage.messageCache['trelloChannels'].stageThree).messages.fetch(db.message_id);
                let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id !== client.user.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', reaction => {
                    collector.stop();
                    msg.delete();
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                        .setDescription(db.embed_desc)
                        .addField(`Task:`, db.embed_task)
                    client.channels.get(client.storage.messageCache['trelloChannels'].stageFour).send(embed).then(message => {
                        db.card_stage = 4;
                        db.message_id = message.id;
                        db.save((err) => {
                            if (err) return reject(err);
                            else return resolve();
                        });
                    });
                });
            });
        });
    }
}
