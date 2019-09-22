const log = require(`../methods/log`);
module.exports = (min, max) => {
    new log().debug(`Function ran: genNumberBetween.js`);
    min = parseInt(min);
    max = parseInt(max);
    let no = Math.floor(Math.random() * (max - min + 1) + min);
    return no;
}
