const modules = require(`../modules`);
module.exports = modules.mongoose.model(`memberGreetings`, new modules.mongoose.Schema({
    message_id: String,
    latest_memberAdd_id: {
        type: String,
        default: null
    },
    latest_memberLeave: [{
        id: String,
        tag: String
    }]
}));