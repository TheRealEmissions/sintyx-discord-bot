const modules = require(`./modules.js`);
const models = require(`./models.js`);
const storage = require(`./storage.js`);
const functions = require(`./functions.js`)
const client = new modules.Discord.Client({
    disableEveryone: false,
    shardCount: 1,
    totalShardCount: 1,
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllMembers: false,
    restWsBridgeTimeout: 5000,
    restTimeOffset: 500,
    restSweepInterval: 60,
    disabledEvents: ["TYPING_START"]
});


/*
HANDLERS
*/

let url = `mongodb+srv://user:Hd5V1v3UiOhBMS3S@emissions-fmfww.mongodb.net/sintyx?retryWrites=true&w=majority`;
modules.mongoose.connect(url, { useNewUrlParser: true });
modules.mongoose.connection.on('error', console.error.bind(console, '[ERROR] Connection error:'));
modules.mongoose.connection.once('open', () => {
    console.log(`[LOG] Connected to the database.`);
});

modules.fs.readdir(`./events/`, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
        console.log(`[LOG] Loaded event ${file}`);
    });
});

const { CommandHandler } = require(`djs-commands`);
let cmdHandler = new CommandHandler({
    folder: __dirname + `/commands/`,
    prefix: ["-"]
});

/*
BINDINGS
*/

client.modules = modules;
client.commandHandler = cmdHandler;
client.storage = storage;
client.functions = functions;
client.models = models;

/*
EXPORTS + LOGIN
*/

module.exports = client;
client.login(storage.auth['token']);