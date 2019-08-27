const modules = require(`../modules.js`);

let userProfiles = new modules.mongoose.Schema({
    user_id: String,
    user_xp: Number,
    user_level: Number,
    user_coins: Number,
    user_slogan: String,
    message_count: {
        type: Number,
        required: true,
        default: 0
    },
    open_tickets: [{
        reference_id: String
    }],
    punishment_history: [{
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        moderator_id: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: false,
            default: null
        }
    }],
    ticket_history: [{
        reference_id: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            required: true
        }
    }],
    blacklisted: {
        type: Boolean,
        required: false,
        default: false
    },
    application_log: [{
        reference_id: {
            type: String,
            required: false
        }
    }]
});

module.exports = modules.mongoose.model(`userProfiles`, userProfiles);
