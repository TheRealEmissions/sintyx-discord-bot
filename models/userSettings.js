const modules = require(`../modules.js`);

let userSettings = new modules.mongoose.Schema({
    user_id: String,
    options: [{
        name: String,
        boolean: Boolean
    }]
});

module.exports = modules.mongoose.model(`userSettings`, userSettings);