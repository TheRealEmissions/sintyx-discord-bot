module.exports = {
    "help": {
        description: `This command relays to the user all the available commands a user has access to. It can be used to find out what the functions of commands are and how they act and respond to a user running them.`,
        exampleUse: `-help\n-help help\n-help stats`,
        aliases: `-guide\n-helpme\n-h`
    },
    "stats": {
        description: "This command displays all the information regarding the bot and the server. It can be useful to run this command if you believe the bot or the server is running slow.",
        exampleUse: "-stats",
        aliases: `-statistics\n-info\n-botinfo\n-status`
    },
    "urban": {
        description: `This command will research the Urban Dictionary directly the term or phrase you input into the command! It will display the first definition shown on the Urban Dictionary website and will, furthermore, display the up and down-votes on that particular definition. You can view the page itself by clicking on the defintion displayed.`,
        exampleUse: `-urban guy\n-urban White House\n-urban The President`,
        aliases: `-urbandictionary`
    },
    "errorcode": {
        description: `If, for any reason, a command or function within this bot errors or has a problem, you will be shown an error code. This error code can be shown to staff members who can fix the problem. This command is used to look up that specific error code to find the underlying issue. There are many variations of error codes that follow a format of letters then numbers.`,
        exampleUse: `-errorcode S001\n-errorcode ST001`,
        aliases: `-error\n-errcode\n-errorcodes\n-err`
    },
    "support": {
        description: `If, for any reason, you have an issue, please feel free to run this command to open a Support Ticket! These tickets can be used to discuss any problems you may have regarding Sintyx such as in-game bugs or payment issues to say the least.`,
        exampleUse: `-support The store won't accept my bank card\n-support Help me please`,
        aliases: `-supportticket`
    },
    "close": {
        description: `This command will close (delete) a Support Ticket with an optional reason after 10 seconds of confirming the closure. Anyone in the ticket can use this command.`,
        exampleUse: `-close Resolved issue\n-close Ticket not needed\n-close`,
        aliases: `-delete\n-cl`
    },
    "ban": {
        description: `This command will blacklist a user from the Discord. Blacklisting effectively removes any and all permissions from a user and only allows them to view permissions from the given Blacklisted role. This is an alternative from banning them from the Discord itself and helps keep track of banned users that could possibly be reunited with the community. The command supports a wizard system - running ` + "`" + `-ban` + "`" + ` by itself - and a standard system of` + "`" +  `-ban @user reason` + "`" + `.`,
        exampleUse: `-ban\n-ban @john Rule Breaking`,
        aliases: `-blacklist`
    },
    "roleinfo": {
        description: `This command will return information regarding any role on the server. Pretty self explanatory.`,
        exampleUse: `-roleinfo Member\n-roleinfo 567441043822477322\n-roleinfo <@&567441043822477322>`,
        aliases: `No aliases currently.`
    },
    "evaluate": {
        description: `This command is used to evaluate code on the bot as if it were running the code from files. This command can only be accessed by the bot creator for safety reasons - this command is very powerful.`,
        exampleUse: `-evaluate message.channel.send("test");`,
        aliases: `-eval`
    },
    "test": {
        description: `This command is an 'example' command that can be structured to do anything Emissions needs it to.`,
        exampleUse: `-test [options]`,
        aliases: `No aliases currently.`
    },
    "trello": {
        description: `As Project Voyager desired a dedicated system to manage our 'to-do list', we didn't want to use anymore platforms than we currently do. This inspired us to create a Trello system within Discord. Currently, we have four channels that allows us to move cards between those channels with a sophisticated editing system. This system drives the production you see today.`,
        exampleUse: `-trello post\n-trello edit D987d874\n-trello del D987d874`,
        aliases: `No aliases currently.`
    }
}