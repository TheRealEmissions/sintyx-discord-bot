const {
    mongoose
} = require(`../modules`);
module.exports = mongoose.model(`shopData`, mongoose.Schema({
    item_id: String,
    item_price: Number,
    item_amount: Number,
    inventory_id: Number
}))
