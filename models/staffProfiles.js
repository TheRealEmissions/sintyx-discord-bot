const {
    mongoose
} = require(`../modules`);
module.exports = mongoose.model(`staffProfiles`, new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    currently_staff: {
        type: Boolean,
        required: false,
        default: true
    },
    position_log: [{
        type: String, // i.e. Accepted, Removed, Demoted, Promoted
        timestamp: Date,
        role_id: String
    }],
    role_id: {
        type: String,
        required: false,
        default: null
    },
    punishments: [{
        user_id: String,
        reference_id: String
    }]
}));
