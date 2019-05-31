const modules = require(`../modules.js`);

let userSettings = new modules.mongoose.Schema({
    user_id: String,
    xp_ping: Boolean
});

module.exports = modules.mongoose.model(`userSettings`, userSettings);