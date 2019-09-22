const log = require(`../methods/log`);
module.exports = (max) => {
    new log().debug(`Function ran: percentChance.js`);
    let a = Math.floor(Math.random() * Math.floor(max));
    let b = Math.floor(Math.random() * Math.floor(max));
    if (a == b) {
        return true;
    } else {
        return false;
    }
}
