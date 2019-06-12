// user ID
// reference ID
// channel ID
// reason for open
// [ message logs ]
// closed by ID OR null
// reason for closure OR null
const modules = require(`../modules`);
module.exports = modules.mongoose.model(`supportTickets`, new modules.mongoose.Schema({
    user_id: String,
    reference_id: String,
    channel_id: String,
    channel_reason: String,
    logs: [{
        user_id: String,
        message_id: String,
        message_content: String,
        timestamp: String
    }],
    closure_id: {
        type: String,
        default: null,
        required: false
    },
    closure_reason: {
        type: String,
        default: null,
        required: false
    }
}));