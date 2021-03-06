let roles = require(`./roles.js`)

module.exports = {
    'S001': 'Could not find CATEGORY for CHANNEL',
    'ST001': 'Error while REQUESTING site for server statistics.',
    'U001': 'Could not RESOLVE search for term or phrase.',
    'S002': `Could not find SUPPORT TICKET MANAGER ROLE for CHANNEL. Current ID ${roles['supportTicketManager']}.`,
    'U002': `Attempted to set embed field more than 1024 in length.`,
    'H001': 'Could not find INFORMATION for COMMAND',
    'U003': 'Error while REQUESTING site for URBAN DICTIONARY.',
    'B001': 'Could not find MENTIONED USER',
    'B002': 'Could not SEND MESSAGE to CHANNEL',
    'B003': 'Could not SEND MESSAGE to USER via DM',
    'B004': 'Could not EDIT MESSAGE',
    'B005': 'Could not REACT to MESSAGE',
    'B006': 'Could not ADD ROLE to USER'
}