module.exports = class discrim {
    constructor() {
        this.name = 'discrim',
            this.alias = ['discriminator'],
            this.usage = '-discrim <4 digit number>',
            this.category = 'misc',
            this.description = 'Get a list of users with a specific discriminator'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        if (args[1].length == 4) {
            let obj = []
            message.guild.members.forEach(member => {
                if (member.user.discriminator == args[1]) {
                    obj.push({
                        id: member.user.id
                    });
                }
            });
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .addField(`Users with the discriminator **${args[1]}**:`, obj.map(r => `<@${r.id}>`).join(`\n`))
            message.channel.send(embed);
            return new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
        }
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
