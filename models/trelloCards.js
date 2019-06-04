const modules = require(`../modules.js`);
module.exports = modules.mongoose.model(`trelloCards`, new modules.mongoose.Schema({
    card_id: String,
    card_stage: Number,
    message_id: String,
    embed_title: String,
    embed_desc: String,
    embed_task: String
}));