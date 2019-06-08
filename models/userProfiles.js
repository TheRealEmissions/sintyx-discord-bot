const modules = require(`../modules.js`);

let userProfiles = new modules.mongoose.Schema({
    user_id: String,
    user_xp: Number,
    user_level: Number,
    user_coins: Number
});

module.exports = modules.mongoose.model(`userProfiles`, userProfiles);