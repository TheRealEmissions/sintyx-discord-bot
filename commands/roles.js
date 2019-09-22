module.exports = class roles {
    constructor() {
        this.name = 'roles',
            this.alias = ["rolelist"],
            this.usage = '-roles',
            this.category = 'misc',
            this.description = 'View a list of all roles and its member count'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        let roles = []
        message.guild.roles.filter(r => r.name !== "@everyone").forEach(role => {
            roles.push({
                id: role.id,
                member_count: role.members.size
            });
        });
        let embed = new client.modules.Discord.MessageEmbed()
            .setColor(message.guild.member(client.user).displayHexColor)
            .addField(`Role`, roles.map(r => `<@&${r.id}>`).join(`\n`), true)
            .addField(`Member Count`, roles.map(r => `${r.member_count}`).join(`\n`), true)
        message.channel.send(embed);
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
