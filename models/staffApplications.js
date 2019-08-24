const {
    mongoose
} = require(`../modules`);
module.exports = mongoose.model(`staffApplications`, new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    reference_id: {
        type: String,
        required: true
    },
    responses: [{
        id: Number,
        content: String
    }],
    timestamp: {
        type: Date,
        required: false,
        default: new Date().getTime()
    }
}));
