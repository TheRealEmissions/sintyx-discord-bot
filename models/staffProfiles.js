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
    position_log: Array,
    role_id: {
        type: String,
        required: false,
        default: null
    },
    punishments: Array
    // ^^
    // user_id: String
    // reference_id: String
}));
