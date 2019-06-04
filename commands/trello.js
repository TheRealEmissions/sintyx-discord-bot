module.exports = class trello {
    constructor() {
        this.name = 'trello',
            this.alias = [],
            this.usage = '-trello',
            this.modules = require(`../modules.js`)
    }

    async run(client, message, args) {
        if (!args[1]) return;
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
                                    if (reaction.emoji.name == client.storage.emojiCharacters['white_check_mark']) {
                                        // post to to-do channel
                                        let _cardID = trello.modules.random_string({
                                            length: 7,
                                            type: 'url-safe'
                                        });
                                        let embed = new client.modules.Discord.MessageEmbed()
                                            .setTitle(`${titleMessage} - **${_cardID}**`)
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
    }
}