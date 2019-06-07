module.exports = class trello {
    constructor() {
        this.name = 'trello',
            this.alias = [],
            this.usage = '-trello',
            this.modules = require(`../modules.js`)
    }

    async run(client, message, args) {
        if (!args[1]) return;

        // post system
        if (args[1].toString() == "post") {
            let main = new this.modules.Discord.MessageEmbed()
                .setTitle(`**Trello Cards**`)
            let title = new this.modules.Discord.MessageEmbed()
                .setDescription(`What is the title of this card?`)
            let description = new this.modules.Discord.MessageEmbed()
                .setDescription(`What is the description of this card?`)
            let task = new this.modules.Discord.MessageEmbed()
                .setDescription(`What is this task of this card?`)
            let trello = this;
            message.channel.send(await main).then(async function (origMsg) {
                // title
                message.channel.send(await title).then(async function (wizardMsg) {
                    let titleCollector = new trello.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                        max: 1
                    });
                    titleCollector.on('collect', async function (titleMessage) {
                        titleCollector.stop();
                        titleMessage.delete();
                        origMsg.edit(await main.addField(`Title`, titleMessage, true));
                        // description
                        wizardMsg.edit(await description);
                        let descCollector = new trello.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                            max: 1
                        });
                        descCollector.on('collect', async function (descMessage) {
                            descCollector.stop();
                            descMessage.delete();
                            origMsg.edit(await main.addField(`Description`, descMessage, true));
                            // task
                            wizardMsg.edit(await task);
                            let taskCollector = new trello.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                max: 1
                            });
                            taskCollector.on('collect', async function (taskMessage) {
                                taskCollector.stop();
                                taskMessage.delete();
                                origMsg.edit(await main.addField(`Task`, taskMessage, true));
                                wizardMsg.delete();
                                // confirmation
                                origMsg.react(client.storage.emojiCharacters['white_check_mark']);
                                origMsg.react(client.storage.emojiCharacters['x']);
                                let filter = (reaction, user) => ((reaction.emoji.name == client.storage.emojiCharacters['white_check_mark']) || (reaction.emoji.name == client.storage.emojiCharacters['x'])) && user.id == message.author.id;
                                let collector = new trello.modules.Discord.ReactionCollector(origMsg, filter, {});
                                collector.on('collect', function (reaction) {
                                    collector.stop();
                                    if (reaction.emoji.name == client.storage.emojiCharacters['white_check_mark']) {
                                        // post to to-do channel
                                        let _cardID = trello.modules.random_string({
                                            length: 7,
                                            type: 'url-safe'
                                        });
                                        let embed = new client.modules.Discord.MessageEmbed()
                                            .setTitle(`**${_cardID}** - ${titleMessage}`)
                                            .setDescription(descMessage)
                                            .addField(`Task:`, taskMessage)
                                        client.channels.find(x => x.id == "585524157463134237").send(embed).then(msg => {
                                            // save info to database for NEW card
                                            let newCard = new client.models.trelloCards({
                                                card_id: _cardID,
                                                card_stage: 1,
                                                message_id: msg.id,
                                                embed_title: titleMessage,
                                                embed_desc: descMessage,
                                                embed_task: taskMessage
                                            });
                                            newCard.save(function (err) {
                                                if (err) return console.error(err);
                                                msg.react(client.storage.emojiCharacters['thumbs_up']);
                                                client.functions.startTrelloCollector(client, 1, _cardID);
                                            });
                                        });
                                    } else {
                                        origMsg.delete();
                                        message.channel.send(`Cancelled.`).then(msg => {
                                            setTimeout(() => {
                                                msg.delete();
                                            }, 5000);
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            }).catch(err => console.error(err));
        }
        // edit system
        if (args[1].toString() == "edit") {
            if (!args[2]) {
                return;
            } else {
                client.models.trelloCards.findOne({
                    "card_id": args[2]
                }, (err, db) => {
                    if (err) return console.error(err);
                    if (!db) {
                        message.channel.send("This card ID does not exist! Please check the card ID again.");
                    } else {
                        let wizard = new client.modules.Discord.MessageEmbed()
                            .setDescription(`Which part of the card do you wish to edit? Please type your reply. *(title, description, task or stage)*`)
                        message.channel.send(wizard).then(origMsg => {
                            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                max: 1
                            });
                            collector.on('collect', wizardMessage => {
                                collector.stop();
                                wizardMessage.delete();
                                if (wizardMessage.toString() == "title") {
                                    let embed = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`Selected: **title**`)
                                        .setDescription(`What do you wish to change the title to?`)
                                        .addField(`Current title:`, "`" + db.embed_title + "`");
                                    origMsg.edit(embed);
                                    let msgCollector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                        max: 1
                                    });
                                    msgCollector.on('collect', async (titleMessage) => {
                                        db.embed_title = titleMessage.content;
                                        db.save((err) => console.error(err));
                                        let msg = await client.channels.find(x => x.id == (Boolean(db.card_stage == 1) ? client.storage.messageCache['trelloChannels'].stageOne : (Boolean(db.card_stage == 2) ? client.storage.messageCache['trelloChannels'].stageTwo : (Boolean(db.card_stage == 3) ? client.storage.messageCache['trelloChannels'].stageThree : client.storage.messageCache['trelloChannels'].stageFour)))).messages.fetch(db.message_id);
                                        let embed = new client.modules.Discord.MessageEmbed()
                                            .setTitle(`**${db.card_id}** - ${titleMessage.content}`)
                                            .setDescription(db.embed_desc)
                                            .addField(`Task:`, db.embed_task)
                                        msg.edit(embed).then(msg => {
                                            let confirmed = new client.modules.Discord.MessageEmbed()
                                                .setDescription(`${client.storage.emojiCharacters['white_check_mark']} Updated the **title** to: ` + "`" + titleMessage.content + "`")
                                            origMsg.edit(confirmed);
                                            titleMessage.delete();
                                        }).catch(err => console.error(err));
                                    });
                                }
                                if (wizardMessage.toString() == "description") {
                                    let embed = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`Selected: **description**`)
                                        .setDescription(`What do you wish to change the description to?`)
                                        .addField(`Current description:`, "`" + db.embed_desc + "`");
                                    origMsg.edit(embed);
                                    let msgCollector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                        max: 1
                                    });
                                    msgCollector.on('collect', async (descMessage) => {
                                        db.embed_desc = descMessage.content;
                                        db.save((err) => console.error(err));
                                        let msg = await client.channels.find(x => x.id == (Boolean(db.card_stage == 1) ? client.storage.messageCache['trelloChannels'].stageOne : (Boolean(db.card_stage == 2) ? client.storage.messageCache['trelloChannels'].stageTwo : (Boolean(db.card_stage == 3) ? client.storage.messageCache['trelloChannels'].stageThree : client.storage.messageCache['trelloChannels'].stageFour)))).messages.fetch(db.message_id);
                                        let embed = new client.modules.Discord.MessageEmbed()
                                            .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                                            .setDescription(descMessage.content)
                                            .addField(`Task:`, db.embed_task)
                                        msg.edit(embed).then(msg => {
                                            let confirmed = new client.modules.Discord.MessageEmbed()
                                                .setDescription(`${client.storage.emojiCharacters['white_check_mark']} Updated the **description** to: ` + "`" + descMessage.content + "`")
                                            origMsg.edit(confirmed);
                                            descMessage.delete();
                                        }).catch(err => console.error(err));
                                    });
                                }
                                if (wizardMessage.toString() == "task") {

                                }
                                if (wizardMessage.toString() == "stage") {

                                }
                            })
                        });
                    }
                })
            }
        }

        // delete system
        if (args[1].toString() == "del" || "delete") {

        }
    }
}