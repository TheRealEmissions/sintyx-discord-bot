const modules = require(`../modules.js`);

let userProfiles = new modules.mongoose.Schema({
    user_id: String,
    user_xp: Number,
    user_level: Number,
    user_coins: Number,
    message_count: {
        type: Number,
        required: true,
        default: 0
    },
    open_tickets: [{
        reference_id: String
    }]
});

module.exports = modules.mongoose.model(`userProfiles`, userProfiles);