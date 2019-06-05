module.exports = function startTrelloCollector(client, stage, card_id) {
    function stageThree() {
        client.models.trelloCards.findOne({
            "card_stage": 3,
            "card_id": card_id
        }, async (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return console.error(`Could not initiate TRELLO COLLECTOR, no DATABASE ENTRIES found`);
            } else {
                let msg = await client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageThree).messages.fetch(db.message_id);
                let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['white_check_mark'] && user.id !== client.user.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', reaction => {
                    collector.stop();
                    msg.delete();
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                        .setDescription(db.embed_desc)
                        .addField(`Task:`, db.embed_task)
                    client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageFour).send(embed).then(message => {
                        db.card_stage = 4;
                        db.message_id = message.id;
                        db.save((err) => {
                            console.error(err);
                        });
                    });
                });
            }
        });
    }

    function stageTwo() {
        client.models.trelloCards.findOne({
            "card_stage": 2,
            "card_id": card_id
        }, async (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return console.error(`Could not initiate TRELLO COLLECTOR, no DATABASE ENTRIES found`);
            } else {
                let msg = await client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageTwo).messages.fetch(db.message_id);
                let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['double_arrow_forward'] && user.id !== client.user.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', reaction => {
                    collector.stop();
                    msg.delete();
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                        .setDescription(db.embed_desc)
                        .addField(`Task:`, db.embed_task)
                    client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageThree).send(embed).then(message => {
                        db.card_stage = 3;
                        db.message_id = message.id;
                        db.save((err) => {
                            console.error(err);
                            message.react(client.storage.emojiCharacters['white_check_mark']);
                            stageThree();
                        });
                    });
                });
            }
        });
    }

    function stageOne() {
        client.models.trelloCards.findOne({
            "card_stage": 1,
            "card_id": card_id
        }, async (err, db) => {
            if (err) return console.error(err);
            if (!db) {
                return console.error(`Could not initiate TRELLO COLLECTOR, no DATABASE ENTRIES found`);
            } else {
                let msg = await client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageOne).messages.fetch(db.message_id);
                let filter = (reaction, user) => reaction.emoji.name == client.storage.emojiCharacters['thumbs_up'] && user.id !== client.user.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', reaction => {
                    collector.stop();
                    msg.delete();
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                        .setDescription(db.embed_desc)
                        .addField(`Task:`, db.embed_task)
                    client.channels.find(x => x.id == client.storage.messageCache['trelloChannels'].stageTwo).send(embed).then(message => {
                        db.card_stage = 2;
                        db.message_id = message.id;
                        db.save((err) => {
                            console.error(err);
                            message.react(client.storage.emojiCharacters['double_arrow_forward']);
                            stageTwo()
                        });
                    });
                });
            }
        });
    }


    if (stage == 1) {
        stageOne();
    } else if (stage == 2) {
        stageTwo();
    } else if (stage == 3) {
        stageThree();
    }
}