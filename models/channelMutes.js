const modules = require(`../modules`);
module.exports = modules.mongoose.model(`channelMutes`, new modules.mongoose.Schema({
    channel_id: String,
    muted: Boolean
}));