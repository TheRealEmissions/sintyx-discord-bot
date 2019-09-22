const log = require(`../methods/log`);
module.exports = function trim(str, max) {
    new log().debug(`Function ran: trim.js`);
    return ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
}
