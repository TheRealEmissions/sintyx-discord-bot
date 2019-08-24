const {
    mongoose
} = require(`../modules`);
module.exports = mongoose.model(`suggestionsData`, new mongoose.Schema({
    reference_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    message_id: {
        type: String,
        required: true
    },
    suggestion_desc: {
        type: String,
        required: true
    },
    suggestion_timestamp: {
        type: Date,
        required: false,
        default: new Date()
    },
    suggestion_info: [{
        type: {
            type: String,
            required: false,
        },
        timestamp: {
            type: Date,
            required: false,
        },
        comment: {
            type: String,
            required: false
        }
    }]
}))
