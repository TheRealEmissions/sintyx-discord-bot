class questions {
    constructor() {};

    embed(cl, c, d) {
        return new cl.modules.Discord.MessageEmbed()
            .setColor(c.guild.member(cl.user).displayHexColor)
            .setDescription(d)
    }

    textCollector(cl, c, u, qn) {
        return new Promise((resolve, reject) => {
            c.send(this.embed(cl, c, cl.storage.appQs[qn])).then(msg => {
                c.updateOverwrite(u, {
                    SEND_MESSAGES: true
                });
                let co = new cl.modules.Discord.MessageCollector(c, m => m.author.id == u.id, {});
                co.on('collect', async m => {
                    co.stop();
                    await c.updateOverwrite(u, {
                        SEND_MESSAGES: false
                    });
                    await msg.delete();
                    await m.delete();
                    return resolve(m.content);
                });
            });
        });
    }

    reactionCollectorBoolean(cl, c, u, qn, e = ['✔', '❌']) {
        return new Promise((resolve, reject) => {
            c.send(this.embed(cl, c, cl.storage.appQs[qn])).then(msg => {
                // allow reacting
                for (const em of e) {
                    msg.react(em);
                }
                let co = new cl.modules.Discord.ReactionCollector(msg, (reaction, user) => reaction.emoji.name !== '🤦‍' && user.id == u.id, {});
                co.on('collect', async reaction => {
                    // deny reacting
                    await msg.delete();
                    if (reaction.emoji.name == e[0]) return resolve(true);
                    else return resolve(false);
                });
            });
        });
    }

}

module.exports = class apply extends questions {
    constructor() {
        super();
        this.name = 'apply',
            this.alias = [],
            this.usage = '-apply',
            this.category = 'user',
            this.description = 'Apply to become a Helper for Sintyx!'
    }

    async run(client, message, args) {
        let category = message.guild.channels.find(x => x.name == "Applications"),
            reference = client.modules.random_string({
                length: 10,
                type: 'base64'
            });
        if (!category) return;
        let startDate = parseInt((new Date().getTime()));
        message.channel.send(`${client.storage.emojiCharacters['timer']} Creating your application channel... please wait.`).then(async startMsg => {
            const channel = await this.handleAppCreation(message, reference, category);
            const beginningMsg = await this.startMessage(client, channel, message.author);
            let endDate = parseInt((new Date().getTime()) - startDate);
            startMsg.edit(` `).then(() => startMsg.edit(new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`:white_check_mark: Created your application channel... ${channel}`)
                .setFooter(`Processed in ${endDate}ms`)
            ));
            let collector = new client.modules.Discord.ReactionCollector(beginningMsg, (reaction, user) => reaction.emoji.name == '✅' && user.id == message.author.id, {});
            collector.on('collect', reaction => {
                collector.stop();
                beginningMsg.delete();
                this.questions(client, channel, message).then((responses) => {
                    let db = new client.models.staffApplications({
                        user_id: message.author.id,
                        reference_id: reference,
                        responses: responses
                    });
                    db.save((err) => {
                        if (err) return new client.methods.log(client).error(err);
                        else {
                            channel.send(new client.modules.Discord.MessageEmbed()
                                .setColor(message.guild.member(client.user).displayHexColor)
                                .setDescription(`Thank you for completing the application! It has been submitted to Management for review. If you would like to let us know anything else, please type below. Here are your answers to the questions:`)
                            );
                            let str = client.modules.Discord.splitMessage(responses.map(r => `**${client.storage.appQs[r.id]}**\n${r.content}\n * *`).join(`\n`), 2000);
                            for (const s of str) {
                                channel.send(s);
                            }
                        }
                    });
                }).catch(err => new client.methods.log(client).error(err));
            });
        });
    }

    handleAppCreation(message, reference, category) {
        return new Promise((resolve, reject) => {
            message.guild.channels.create(`app-${message.author.username}-${reference}`).then(channel => {
                channel.setParent(category);
                channel.overwritePermissions({
                    permissionOverwrities: [{
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                        deny: ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS']
                    }, {
                        id: message.guild.roles.find(x => x.name == '@everyone').id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }],
                    reason: 'Needed to change permissions'
                });
                return resolve(channel);
            });
        });
    }

    startMessage(client, c, u) {
        return new Promise((resolve, reject) => {
            c.send(`<@${u.id}>`).then(msg => msg.delete());
            let questionArray = [];
            for (const n in client.storage.appQs) {
                questionArray.push(client.storage.appQs[n]);
            }
            c.send(new client.modules.Discord.MessageEmbed()
                .setColor(c.guild.member(client.user).displayHexColor)
                .setTitle(`**Hey ${u.username}!** Welcome to your application.`)
                .setDescription(`This application may take a lot of time. These are the questions you will be asked:
                    >>> ${questionArray.map(q => `- ${q}`).join(`\n`)}`)
                .setFooter(`To begin your application, select ✅`)
            ).then(msg => {
                msg.react(`✅`);
                return resolve(msg);
            })
        });
    }

    questions(client, channel, message) {
        return new Promise(async (resolve, reject) => {
            let qs = {
                0: await this.textCollector(client, channel, message.author, 0),
                1: await this.textCollector(client, channel, message.author, 1),
                2: await this.textCollector(client, channel, message.author, 2),
                3: await this.textCollector(client, channel, message.author, 3),
                4: await this.reactionCollectorBoolean(client, channel, message.author, 4),
                5: await this.reactionCollectorBoolean(client, channel, message.author, 5),
                6: await this.textCollector(client, channel, message.author, 6),
                7: await this.textCollector(client, channel, message.author, 7),
                8: await this.textCollector(client, channel, message.author, 8),
                9: await this.textCollector(client, channel, message.author, 9),
                10: await this.textCollector(client, channel, message.author, 10),
                11: await this.textCollector(client, channel, message.author, 11),
                12: await this.textCollector(client, channel, message.author, 12),
                13: await this.textCollector(client, channel, message.author, 13),
                14: await this.textCollector(client, channel, message.author, 14),
                15: await this.reactionCollectorBoolean(client, channel, message.author, 15),
                16: await this.textCollector(client, channel, message.author, 16),
                17: await this.textCollector(client, channel, message.author, 17),
                18: await this.textCollector(client, channel, message.author, 18)
            }
            let responses = []
            for (const q in qs) {
                responses.push({
                    id: q,
                    content: qs[q]
                });
            }
            return resolve(responses);
        });
    }
}
