const { mongoose } = require(`../modules`);
module.exports = mongoose.model(`suggestionsData`, new mongoose.Schema({
    reference_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    suggestion_desc: {
        type: String,
        required: true
    },
    suggestion_timestamp: {
        type: Date,
        required: true
    },
    suggestion_info: [{
        type: {
            type: String,
            required: true,
            default: 'PENDING'
        },
        timestamp: {
            type: Date,
            required: false,
            default: new Date()
        },
        comment: {
            type: String,
            required: true
        }
    }]
}))