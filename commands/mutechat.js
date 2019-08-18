module.exports = class mutechat {
    constructor() {
        this.name = 'mutechat',
        this.alias = [],
        this.usage = 'mutechat [<on/off>/<reason>] [reason]',
        this.category = 'administration',
        this.description = 'Mute a chat for normal users in a particular channel'
    }

    setPerms(channel, role, boolean) {
        return new Promise((resolve, reject) => {
            channel.updateOverwirte(role, {
                SEND_MESSAGES: boolean,
                ADD_REACTIONS: boolean
            }).catch(err => reject(err));
        });
    }

    muteChannel(channel, guild) {
        return new Promise((resolve, reject) => {
            let roles = [guild.roles.find(x => x.name == "Analysts"), guild.roles.find(x => x.name == "@everyone")];
            roles.forEach(role => {
                this.setPerms(channel, role, false).catch(err => reject(err));
            });
        });
    }

    unmuteChannel(channel, guild) {
        return new Promise((resolve, reject) => {
            let roles = [guild.roles.find(x => x.name == "Analysts"), guild.roles.find(x => x.name == "@everyone")];
            roles.forEach(role => {
                this.setPerms(channel, role, true).catch(err => reject(err));
            });
        });
    }

    async run(client, message, args) {
        if (message.member.roles.find(x => x.name == "Management")) {
            /*
            Roles to deny sending messages & reactions:

            Analysts
            @everyone

            */
           client.models.channelMutes.findOne({
               "channel_id": message.channel.id
           }, (err, db) => {
               if (err) return new client.methods.log(client, message.guild).error(err);
               if (!db) {
                   let newdb = new client.models.channelMutes({
                       channel_id: message.channel.id,
                       muted: true
                   });
                   newdb.save((err) => new client.methods.log(client, message.guild).error(err));
                   this.muteChannel(message.channel, message.guild).catch(err => new client.methods.log(client, message.guild).error(err));
                   let reason;
                   if (args[1] == (("on") || ("off")) && args[2]) {
                       reason = message.content.slice(args[0].length + args[1].length + 2);
                   }
                   if (args[1] == (("on") || ("off")) && !args[2]) {
                       reason = 'No reason provided'
                   }
                   if (!args[1]) {
                       reason = 'No reason provided'
                   }
                   if (args[1] !== (("on") || ("off"))) {
                       reason = message.content.slice(args[0].length + 1)
                   }
                   message.channel.send(new client.modules.Discord.MessageEmbed()
                    .setColor(message.guild.member(client.user).displayHexColor)
                    .setTitle(`This channel is currently muted!`)
                    .setDescription(`While a channel is muted, you will be unable to add any new reactions or send messages. Information regarding the channel mute can be seen below.`)
                    .addField(`Executor:`, `<@${message.author.id}>\n*(${message.author.id})*`, true)
                    .addField(`Reason:`, "```" + reason + "```", true)
                   );
               } else {
                if (args[1]) {
                    if (args[1].toLowerCase() == "on") {
                        if (db.boolean == true) return;
                        this.muteChannel(message.channel, message.guild);
                        let reason = args[2] ? message.content.slice(args[0].length + args[1].length + 2) : 'No reason provided';
                        message.channel.send(new client.modules.Discord.MessageEmbed()
                         .setColor(message.guild.member(client.user).displayHexColor)
                         .setTitle(`This channel is currently muted!`)
                         .setDescription(`While a channel is muted, you will be unable to add any new reactions or send messages. Information regarding the channel mute can be seen below.`)
                         .addField(`Executor:`, `<@${message.author.id}>\n*(${message.author.id})*`, true)
                         .addField(`Reason:`, "```" + reason + "```", true)
                        );
                        db.boolean = true;
                        db.save((err) => new client.methods.log(client, message.guild).error(err));
                        return;
                    }
                    if (args[1].toLowerCase() == "off") {
                        if (db.boolean == false) return;
                        this.unmuteChannel(message.channel, message.guild).catch(err => new client.methods.log(client, message.guild).error(err));
                        message.channel.send(new client.modules.Discord.MessageEmbed()
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`**The channel has been unmuted.** You may chat again and add reactions to messages.`)
                        );
                        db.boolean = false;
                        db.save((err) => new client.methods.log(client, message.guild).error(err));
                        return;
                    }
                    if (db.boolean == true) {
                        this.unmuteChannel(message.channel, message.guild).catch(err => new client.methods.log(client, message.guild).error(err));
                        message.channel.send(new client.modules.Discord.MessageEmbed()
                            .setColor(message.guild.member(client.user).displayHexColor)
                            .setDescription(`**The channel has been unmuted.** You may chat again and add reactions to messages.`)
                        );
                        db.boolean = false;
                        db.save((err) => new client.methods.log(client, message.guild).error(err));
                    } else {
                        this.muteChannel(message.channel, message.guild).catch(err => new client.methods.log(client, message.guild).error(err));
                        let reason = args[2] ? message.content.slice(args[0].length + args[1].length + 2) : args[1];
                        message.channel.send(new client.modules.Discord.MessageEmbed()
                         .setColor(message.guild.member(client.user).displayHexColor)
                         .setTitle(`This channel is currently muted!`)
                         .setDescription(`While a channel is muted, you will be unable to add any new reactions or send messages. Information regarding the channel mute can be seen below.`)
                         .addField(`Executor:`, `<@${message.author.id}>\n*(${message.author.id})*`, true)
                         .addField(`Reason:`, "```" + reason + "```", true)
                        );
                        db.boolean = true;
                        db.save((err) => new client.methods.log(client, message.guild).error(err));
                    }
               } else {
                   if (db.boolean == true) {
                    this.unmuteChannel(message.channel, message.guild).catch(err => new client.methods.log(client, message.guild).error(err));
                    message.channel.send(new client.modules.Discord.MessageEmbed()
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .setDescription(`**The channel has been unmuted.** You may chat again and add reactions to messages.`)
                    );
                    db.boolean = false;
                    db.save((err) => new client.methods.log(client, message.guild).error(err));
                   } else {
                    this.muteChannel(message.channel, message.guild).catch(err => new client.methods.log(client, message.guild).error(err));
                    message.channel.send(new client.modules.Discord.MessageEmbed()
                     .setColor(message.guild.member(client.user).displayHexColor)
                     .setTitle(`This channel is currently muted!`)
                     .setDescription(`While a channel is muted, you will be unable to add any new reactions or send messages. Information regarding the channel mute can be seen below.`)
                     .addField(`Executor:`, `<@${message.author.id}>\n*(${message.author.id})*`, true)
                     .addField(`Reason:`, "```" + 'No reason provided' + "```", true)
                    );
                    db.boolean = true;
                    db.save((err) => new client.methods.log(client, message.guild).error(err));
                   }
               }
               }
           })
        } else return;
    }
}