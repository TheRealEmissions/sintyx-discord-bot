let roles = require(`./roles.js`)

module.exports = {
    'S001': 'Could not find CATEGORY for CHANNEL',
    'ST001': 'Error while REQUESTING site for server statistics. Please refer to console -- error present.',
    'U001': 'Could not RESOLVE search for term or phrase.',
    'S002': `Could not find SUPPORT TICKET MANAGER ROLE for CHANNEL. Current ID ${roles['supportTicketManager']}.`,
    'U002': `Attempted to set embed field more than 1024 in length.`,
    'H001': 'Could not find INFORMATION for COMMAND'
}