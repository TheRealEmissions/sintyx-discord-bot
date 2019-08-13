module.exports = class trello {
    constructor() {
        this.name = 'trello',
            this.alias = [],
            this.usage = '-trello <post/edit/delete> [options]',
            this.modules = require(`../modules.js`)
    }

    async run(client, message, args) {
        console.log(args[0]);
        console.log(args[1]);
        console.log(args[2]);
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
            message.channel.send(await main).then(async (origMsg) => {
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
                                                if (err) return new client.methods.log(client, message.guild).error(err);
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
            }).catch(err => new client.methods.log(client, message.guild).error(err));
        }
        // edit system
        if (args[1].toString() == "edit") {
            if (!args[2]) {
                return;
            } else {
                client.models.trelloCards.findOne({
                    "card_id": args[2]
                }, (err, db) => {
                    if (err) return new client.methods.log(client, message.guild).error(err);
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
                                        db.save((err) => new client.methods.log(client, message.guild).error(err));
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
                                        }).catch(err => new client.methods.log(client, message.guild).error(err));
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
                                        db.save((err) => new client.methods.log(client, message.guild).error(err));
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
                                        }).catch(err => new client.methods.log(client, message.guild).error(err));
                                    });
                                }
                                if (wizardMessage.toString() == "task") {
                                    let embed = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`Selected: **task**`)
                                        .setDescription(`What do you wish to change the task to?`)
                                        .addField(`Current task:`, "`" + db.embed_task + "`");
                                    origMsg.edit(embed);
                                    let msgCollector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                        max: 1
                                    });
                                    msgCollector.on('collect', async (taskMessage) => {
                                        db.embed_task = taskMessage.content;
                                        db.save((err) => new client.methods.log(client, message.guild).error(err));
                                        let msg = await client.channels.find(x => x.id == (Boolean(db.card_stage == 1) ? client.storage.messageCache['trelloChannels'].stageOne : (Boolean(db.card_stage == 2) ? client.storage.messageCache['trelloChannels'].stageTwo : (Boolean(db.card_stage == 3) ? client.storage.messageCache['trelloChannels'].stageThree : client.storage.messageCache['trelloChannels'].stageFour)))).messages.fetch(db.message_id);
                                        let embed = new client.modules.Discord.MessageEmbed()
                                            .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                                            .setDescription(db.embed_desc)
                                            .addField(`Task:`, taskMessage)
                                        msg.edit(embed).then(msg => {
                                            let confirmed = new client.modules.Discord.MessageEmbed()
                                                .setDescription(`${client.storage.emojiCharacters['white_check_mark']} Updated the **task** to: ` + "`" + taskMessage.content + "`")
                                            origMsg.edit(confirmed);
                                            taskMessage.delete();
                                        }).catch(err => new client.methods.log(client, message.guild).error(err));
                                    });
                                }
                                if (wizardMessage.toString() == "stage") {
                                    let embed = new client.modules.Discord.MessageEmbed()
                                        .setTitle(`Selected: **stage**`)
                                        .setDescription(`What do you wish to change the stage to?`)
                                        .addField(`Current stage:`, "`" + db.card_stage + "`");
                                    origMsg.edit(embed);
                                    let msgCollector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                        max: 1
                                    });
                                    msgCollector.on('collect', async (stageMessage) => {
                                        stageMessage.content = parseInt(stageMessage.content);
                                        console.log(typeof stageMessage.content);
                                        if (stageMessage.content == db.card_stage) {
                                            let embed = new client.modules.Discord.MessageEmbed()
                                                .setDescription(`${client.storage.emojiCharacters['x']} You cannot edit the stage to the stage it is already at!`)
                                            origMsg.edit(embed);
                                            return;
                                        }
                                        if (typeof stageMessage.content !== 'number') {
                                            let embed = new client.modules.Discord.MessageEmbed()
                                                .setDescription(`${client.storage.emojiCharacters['x']} The stage must be a number! (1, 2, 3 or 4)`)
                                            origMsg.edit(embed);
                                            return;
                                        }
                                        if ((stageMessage.content < 0) || (stageMessage.content > 4)) {
                                            let embed = new client.modules.Discord.MessageEmbed()
                                                .setDescription(`${client.storage.emojiCharacters['x']} The stage must be a number between 1 and 4!`)
                                            origMsg.edit(embed);
                                            return;
                                        }
                                        let origMessage = await client.channels.find(x => x.id == (Boolean(db.card_stage == 1) ? client.storage.messageCache['trelloChannels'].stageOne : (Boolean(db.card_stage == 2) ? client.storage.messageCache['trelloChannels'].stageTwo : (Boolean(db.card_stage == 3) ? client.storage.messageCache['trelloChannels'].stageThree : client.storage.messageCache['trelloChannels'].stageFour)))).messages.fetch(db.message_id);
                                        origMessage.delete();
                                        db.card_stage = stageMessage.content;
                                        db.save((err) => new client.methods.log(client, message.guild).error(err));
                                        let channel = await client.channels.find(x => x.id == (Boolean(stageMessage.content == 1) ? client.storage.messageCache['trelloChannels'].stageOne : (Boolean(stageMessage.content == 2) ? client.storage.messageCache['trelloChannels'].stageTwo : (Boolean(stageMessage.content == 3) ? client.storage.messageCache['trelloChannels'].stageThree : client.storage.messageCache['trelloChannels'].stageFour))));
                                        let embed = new client.modules.Discord.MessageEmbed()
                                            .setTitle(`**${db.card_id}** - ${db.embed_title}`)
                                            .setDescription(db.embed_desc)
                                            .addField(`Task:`, db.embed_task);
                                        let reaction = Boolean(stageMessage.content == 1) ? client.storage.emojiCharacters['thumbs_up'] : (Boolean(stageMessage.content == 2) ? client.storage.emojiCharacters['double_arrow_forward'] : (Boolean(stageMessage.content == 3) ? client.storage.emojiCharacters['white_check_mark'] : null))
                                        channel.send(embed).then(msg => {
                                            db.message_id = msg.id;
                                            db.save((err) => new client.methods.log(client, message.guild).error(err));
                                            setTimeout(() => {
                                                if (typeof reaction !== null) {
                                                    msg.react(reaction);
                                                    client.functions.startTrelloCollector(client, stageMessage.content, db.card_id);
                                                }
                                            }, 1000);
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            }
        }

        // delete system
        if ((args[1].toString() == "del") || (args[1].toString() == "delete")) {
            if (!args[2]) return;
            client.models.trelloCards.findOne({
                "card_id": args[2]
            }, async (err, db) => {
                if (err) return new client.methods.log(client, message.guild).error(err);
                if (!db) return message.channel.send(`That card could not be found.`);
                let msg = await client.channels.find(x => x.id == (Boolean(db.card_stage == 1) ? client.storage.messageCache['trelloChannels'].stageOne : (Boolean(db.card_stage == 2) ? client.storage.messageCache['trelloChannels'].stageTwo : (Boolean(db.card_stage == 3) ? client.storage.messageCache['trelloChannels'].stageThree : client.storage.messageCache['trelloChannels'].stageFour)))).messages.fetch(db.message_id);
                msg.delete();
                client.models.trelloCards.findOneAndRemove({
                    "card_id": args[2]
                }, (err, offer) => {
                    if (err) return new client.methods.log(client, message.guild).error(err);
                    message.channel.send(`Removed card **${args[2]}** from their respective channel and database.`)
                });
            })
        }
    }
}