module.exports = class evaluate {
    constructor() {
        this.name = 'evaluate',
        this.alias = ["eval"],
        this.usage = '-evaluate <...code...>',
        this.category = 'administration',
        this.description = 'Evaluate runnable code on the bot'
    }

    async run(client, message, args) {
        if (message.author.id !== "201095756784992256") {
            return;
        } else {
            function evaluate(message, args) {
                function clean(text) {
                    if (typeof (text) === "string")
                        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                    else
                        return text;
                }
                try {
                    let code = args.slice(args[0].length + 1).join(" ");
                    let evaled = eval(code);
                    if (typeof evaled !== "string")
                        evaled = require("util").inspect(evaled);
                    message.channel.send(clean(evaled), {
                        code: "x1"
                    });
                } catch (err) {
                    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
                }
            }
            evaluate(message, args);
        }
    }
}