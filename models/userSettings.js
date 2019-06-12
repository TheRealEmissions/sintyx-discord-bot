const modules = require(`../modules.js`);

let userSettings = new modules.mongoose.Schema({
    user_id: String,
    options: [{
        type: String,
        boolean: Boolean
    }]
});

module.exports = modules.mongoose.model(`userSettings`, userSettings);