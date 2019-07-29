const modules = require(`../modules`);
module.exports = modules.mongoose.model(`userInventories`, modules.mongoose.Schema({
    user_id: String,
    inventory: [{
        id: Number,
        amount: Number
    }]
}))