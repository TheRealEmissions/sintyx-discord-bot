const {
    mongoose
} = require(`../modules`);
module.exports = mongoose.model(`guildSettings`, new mongoose.Schema({
    guild_id: {
        type: String,
        required: true
    },
    xp_booster: [{
        id: {
            type: String
        },
        percent: {
            type: Number
        },
        user_id: {
            type: String
        },
        inventory_id: {
            type: Number
        }
    }],
    coin_booster: [{
        id: {
            type: String
        },
        percent: {
            type: Number
        },
        user_id: {
            type: String
        },
        inventory_id: {
            type: Number
        }
    }]
}));
