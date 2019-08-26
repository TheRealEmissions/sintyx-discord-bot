function getAliases(command) {
    let file = require(`../commands/${command}`);
    let cmd = new file();
    let aliases = cmd.alias.length > 0 ? cmd.alias.join(`\n`) : `No aliases currently`;
    return aliases;
}

module.exports = {
    "help": {
        description: `This command relays to the user all the available commands a user has access to. It can be used to find out what the functions of commands are and how they act and respond to a user running them.`,
        exampleUse: `-help\n-help help\n-help stats`,
        aliases: getAliases('help')
    },
    "stats": {
        description: "This command displays all the information regarding the bot and the server. It can be useful to run this command if you believe the bot or the server is running slow.",
        exampleUse: "-stats",
        aliases: getAliases('stats')
    },
    "urban": {
        description: `This command will research the Urban Dictionary directly the term or phrase you input into the command! It will display the first definition shown on the Urban Dictionary website and will, furthermore, display the up and down-votes on that particular definition. You can view the page itself by clicking on the defintion displayed.`,
        exampleUse: `-urban guy\n-urban White House\n-urban The President`,
        aliases: getAliases('urban')
    },
    "errorcode": {
        description: `If, for any reason, a command or function within this bot errors or has a problem, you will be shown an error code. This error code can be shown to staff members who can fix the problem. This command is used to look up that specific error code to find the underlying issue. There are many variations of error codes that follow a format of letters then numbers.`,
        exampleUse: `-errorcode S001\n-errorcode ST001`,
        aliases: getAliases('errorcode')
    },
    "support": {
        description: `If, for any reason, you have an issue, please feel free to run this command to open a Support Ticket! These tickets can be used to discuss any problems you may have regarding Sintyx such as in-game bugs or payment issues to say the least.`,
        exampleUse: `-support The store won't accept my bank card\n-support Help me please`,
        aliases: getAliases('support')
    },
    "close": {
        description: `This command will close (delete) a Support Ticket with an optional reason after 10 seconds of confirming the closure. Anyone in the ticket can use this command.`,
        exampleUse: `-close Resolved issue\n-close Ticket not needed\n-close`,
        aliases: getAliases('close')
    },
    "ban": {
        description: `This command will blacklist a user from the Discord. Blacklisting effectively removes any and all permissions from a user and only allows them to view permissions from the given Blacklisted role. This is an alternative from banning them from the Discord itself and helps keep track of banned users that could possibly be reunited with the community. The command supports a wizard system - running ` + "`" + `-ban` + "`" + ` by itself - and a standard system of` + "`" + `-ban @user reason` + "`" + `.`,
        exampleUse: `-blacklist\n-blacklist @john Rule Breaking`,
        aliases: getAliases('blacklist')
    },
    "roleinfo": {
        description: `This command will return information regarding any role on the server. Pretty self explanatory.`,
        exampleUse: `-roleinfo Member\n-roleinfo 567441043822477322\n-roleinfo <@&567441043822477322>`,
        aliases: getAliases('roleinfo')
    },
    "evaluate": {
        description: `This command is used to evaluate code on the bot as if it were running the code from files. This command can only be accessed by the bot creator for safety reasons - this command is very powerful.`,
        exampleUse: `-evaluate message.channel.send("test");`,
        aliases: getAliases('evaluate')
    },
    "test": {
        description: `This command is an 'example' command that can be structured to do anything Emissions needs it to.`,
        exampleUse: `-test [options]`,
        aliases: getAliases('test')
    },
    "trello": {
        description: `As Project Voyager desired a dedicated system to manage our 'to-do list', we didn't want to use anymore platforms than we currently do. This inspired us to create a Trello system within Discord. Currently, we have four channels that allows us to move cards between those channels with a sophisticated editing system. This system drives the production you see today.`,
        exampleUse: `-trello post\n-trello edit D987d874\n-trello del D987d874`,
        aliases: getAliases('trello')
    },
    "xp": {
        description: `You can use this command to view your or another persons XP along with how far away they are from levelling up.`,
        exampleUse: `-xp\n-xp @john\n-xp 249279557167742976`,
        aliases: getAliases('xp')
    },
    "level": {
        description: `You can use this command to view your or another persons level along with your or their XP status.`,
        exampleUse: `-level\n-level @john\n-level 249279557167742976`,
        aliases: getAliases('level')
    },
    "coins": {
        description: `You can use this command to view your or another persons coin balance.`,
        exampleUse: `-coins\n-coins @john\n-coins 249279557167742976`,
        aliases: getAliases('coins')
    },
    "profile": {
        description: `With this command you can view information on yourself or another person! This information includes XP amount, coin amount, average XP per msg and more!`,
        exampleUse: `-profile\n-profile @john\n-profile 249279557167742976`,
        aliases: getAliases('profile')
    },
    "add": {
        description: `With this command you can add other users to your currently open Support Ticket.`,
        exampleUse: `-add @john`,
        aliases: getAliases('add')
    },
    "apply": {
        description: `Apply to become a Helper for Sintyx! With this command, it will generate an application ticket through which you'll be taken through our automated application system.`,
        exampleUse: `-apply`,
        aliases: getAliases('apply')
    },
    "discrim": {
        description: `View a list of users in the current guild with the discriminator you stated.`,
        exampleUse: `-discrim 0001\n-discrim 6969`,
        aliases: getAliases('discrim')
    },
    "inventory": {
        description: `With this command, you can easily manage your inventory via reactions. This command states what your inventory contains and options to use, send or delete items from your inventory.`,
        exampleUse: `-inventory`,
        aliases: getAliases('inventory')
    },
    "leaderboard": {
        description: `This command shows you four different types of leaderboard with the top nine users!`,
        exampleUse: `-leaderboard`,
        aliases: getAliases('leaderboard')
    },
    "mentionable": {
        description: `This command allows you to toggle the mentionability of a role.`,
        exampleUse: `-mentionable @VIP\n-mentionable 429273287409284`,
        aliases: getAliases('mentionable')
    },
    "mutechat": {
        description: `This allows a channel to be muted (by denying the ability to send messages of roles) and unmuted.`,
        exampleUse: `-mutechat\n-mutechat on\n-mutechat off\n-mutechat because i want to\n-mutechat on reason here`,
        aliases: getAliases('mutechat')
    },
    "nowplaying": {
        description: `This command allows you to view the currently playing song on Sintyx. This command will only work if you are currently in the same voice channel as Sintyx and Sintyx is playing a song.`,
        exampleUse: `-nowplaying`,
        aliases: getAliases('nowplaying')
    },
    "pause": {
        description: `This allows music to be paused.`,
        exampleUse: `-pause`,
        aliases: getAliases('pause')
    },
    "play": {
        description: `This command allows songs to be played or added to the song queue. It will also connect Sintyx to the voice channel you are currently in. The command supports terms, direct links and playlists.`,
        exampleUse: `-play Ariana Grande\n-play https://youtube.com/v?=abcdefg`,
        aliases: getAliases('play')
    },
    "punishments": {
        description: `This command allows you to view all of your punishments or lookup a specific punishment via its ID. This will provide details on who executed the punishment, the punishment reason etc.`,
        exampleUse: `-punishments\n-punishments abcdefG`,
        aliases: getAliases('punishments')
    },
    "purge": {
        description: `This command allows clearing of mass messages from a channel.`,
        exampleUse: `-purge 100\n-purge 60`,
        aliases: getAliases('purge')
    },
    "queue": {
        description: `This command is used to view the current queue of songs for Sintyx.`,
        exampleUse: `-queue`,
        aliases: getAliases('queue')
    },
    "remove": {
        description: `This command is used in Support Tickets to remove a user from the ticket. This will deny their access to view the ticket. This command does not work if the user has any managerial roles.`,
        exampleUse: `-remove @john\n-remove @alister bye guy`,
        aliases: getAliases('remove')
    },
    "resume": {
        description: `This command is used to resume paused music. This command will only work if the music is paused and you are in the same voice channel as Sintyx.`,
        exampleUse: `-resume`,
        aliases: getAliases('resume')
    },
    "role": {
        description: `This command has a lot of uses:\nAdding roles to users, removing roles from users, toggling roles on/from users, removing all a user's roles, giving everyone or removing everyone from a role, giving or removing bots a role, giving or removing humans a role, and giving or removing a role from everyone with a specific role`,
        exampleUse: `-role add @john @vip\n-role remove @john @mvp\n-role toggle @alex @Member\n-role removeall @peter\n-role all add @MVP\n-role all remove @MVP\n-role bots add @AI\n-role bots remove @AI\n-role humans add @Human\n-role humans remove @Human\n-role in @MVP add @VIP\n-role in @MVP remove @VIP`,
        aliases: getAliases('role')
    },
    "rolecolor": {
        description: `This command can be used to alter a roles colour by stating a hex colour.`,
        exampleUse: `-rolecolor @VIP 0x00000`,
        aliases: getAliases('rolecolor')
    },
    "roles": {
        description: `This command is used to view a list of all roles and how many members have those roles.`,
        exampleUse: `-roles`,
        aliases: getAliases('roles')
    },
    "setnick": {
        description: `This command is used to alter a member's nickname.`,
        exampleUse: `-setnick @john Alex\n-setnick @nggr Racism is not allowed`,
        aliases: getAliases('setnick')
    },
    "settings": {
        description: `This allows you to configure your personal settings such as pings for XP and Coin gain.`,
        exampleUse: `-settings`,
        aliases: getAliases('settings')
    },
    "skip": {
        description: `This command allows you to skip the currently playing song. You must be in the voice channel with Sintyx while it is playing music for it to work.`,
        exampleUse: `-skip`,
        aliases: getAliases('skip')
    },
    "stop": {
        description: `This command stops the bot playing music entirely and clears the queue.`,
        exampleUse: `-stop`,
        aliases: getAliases('stop')
    },
    "suggestionaccept": {
        description: `This command allows suggestions to be accepted and moved into #accepted. When ran, it also asks for a comment that is shown upon accepting a suggestion. This command is largely used when a feature has actually been implemented.`,
        exampleUse: `-suggestionaccept`,
        aliases: getAliases('suggestionaccept')
    },
    "suggestionreject": {
        description: `This command allows suggestions to be denied and moved into #rejected. When ran, it also asks for a comment that is shown upon denying a suggestion.`,
        exampleUse: `-suggestionreject`,
        aliases: getAliases('suggestionreject')
    },
    "tickets": {
        description: `This command is used to view a list of tickets you've opened and their open dates, and also can be used to provide a more in-depth look into a ticket providing information such as the open reason, ticket log etc.`,
        exampleUse: `-tickets\n-tickets abcdefg\n-tickets haghsgdaa`,
        aliases: getAliases('tickets')
    },
    "volume": {
        description: `This command is used to alter the volume (decibels sent) by Sintyx while playing music`,
        exampleUse: `-volume 5\n-volume 4\n-volume 1\n-volume 10`,
        aliases: getAliases('volume')
    }
}
