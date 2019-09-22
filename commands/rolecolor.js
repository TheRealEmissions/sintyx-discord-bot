module.exports = class rolecolor {
    constructor() {
        this.name = 'rolecolor',
            this.alias = ['rolecolour'],
            this.usage = '-rolecolor <@role/role id> <hex color>',
            this.category = 'administration',
            this.description = 'Change the color of a role'
    }

    async run(client, message, args) {
        let startDate = new Date().getTime();
        if (message.member.roles.find(x => x.name == "Management")) {
            let role = Boolean(message.mentions.roles.first()) ? message.mentions.roles.first() : message.guild.roles.get(`${args[1]}`);
            if (!role) {
                return message.channel.send(`Please either mention a role or type its ID.`).then(msg => setTimeout(() => msg.delete(), 5000));
            }
            role.edit({
                color: args[2]
            }).then(() => {
                new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
                return message.channel.send(`Altered the color of **${role.name}** to **${args[2]}**`);
            }).catch(err => message.channel.send(`I couldn't edit that roles color! Error: ${err}`));
        }
        new client.methods.log(client).debugStats(this.name, message.author, new Date().getTime() - startDate);
    }
}
