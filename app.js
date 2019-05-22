const modules = {
    Discord: require(`discord.js`),
    fs: require(`fs`),
    mongoose: require(`mongoose`),
    ms: require(`ms`),
    random_string: require(`crypto-random-string`),
    request: require(`request`),
    querystring: require(`querystring`),
    fetch: require(`node-fetch`)
};
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
const storage = {
    emojiCharacters: require(`./storage/emojiCharacters.js`)
};


/*
HANDLERS
*/

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
})

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
/*
LOGIN
*/

client.login("NTY3NDQxOTUyNjQwMDczNzM4.XOLUag.93IVgEO8LTp1HcJk1M0vbmivQSM");