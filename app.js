const modules = {
    Discord: require(`discord.js`),
    fs: require(`fs`),
    mongoose: require(`mongoose`),
    ms: require(`ms`),
    random_string: require(`crypto-random-string`)
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