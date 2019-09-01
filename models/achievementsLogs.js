const {
    mongoose
} = require(`../modules`);
module.exports = mongoose.model(`achievementsLogs`, new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    achievements: {
        type: Array,
        required: false,
        default: []
    }
}))
