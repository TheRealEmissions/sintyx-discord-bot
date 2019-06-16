module.exports = class test {
    constructor() {
        this.name = 'test',
            this.alias = [],
            this.usage = `-test`,
            this.category = 'administration',
            this.description = 'Command for Emissions'
    }

    async run(client, message, args) {
        if (message.author.id == "201095756784992256") {
            /*message.channel.send(`${client.storage.emojiCharacters['white_check_mark']}`).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            });

            let ec = client.storage.emojiCharacters;
            let embed = new client.modules.Discord.MessageEmbed()
                .setTitle(`**Username Colour**`)
                .setColor(message.guild.member(client.user).displayHexColor)
                .addField(`Red`, ec['heart'], true)
                .addField(`Yellow`, ec['yellow_heart'], true)
                .addField(`Blue`, ec['blue_heart'], true)
                .addField(`Green`, ec['green_heart'], true)
                .addField(`Purple`, ec['purple_heart'], true)
                .addField(`Black`, ec['black_heart'], true)
            message.channel.send(embed).then(async(msg) => {
                await msg.react(ec['heart']);
                await msg.react(ec['yellow_heart']);
                await msg.react(ec['blue_heart']);
                await msg.react(ec['green_heart']);
                await msg.react(ec['purple_heart']);
                await msg.react(ec['black_heart']);
            });*/

            message.channel.send(new client.modules.Discord.MessageEmbed());

        } else {
            return;
        }
    }
}