const modules = require(`./modules.js`);
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
const models = {
    userSettings: require(`./models/userSettings.js`)
}
const storage = {
    auth: require(`./storage/auth.js`),
    emojiCharacters: require(`./storage/emojiCharacters.js`),
    errorCodes: require(`./storage/errorCodes.js`),
    roles: require(`./storage/roles.js`),
    helpInfo: require(`./storage/helpInfo.js`),
    messageCache: require(`./storage/messageCache.js`)
};
const functions = {
    trim: require(`./functions/trim.js`),
    logError: require(`./functions/logError.js`),
    errorEmbed: require(`./functions/errorEmbed.js`),
    startReactionCache: require(`./functions/startReactionCache.js`)
};


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