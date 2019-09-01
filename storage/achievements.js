/*

TYPES:

getXP - get amount of XP
getLevel - get certain level
getCrates - open a certain amount of crates (+ type)
getPouches - open a certain amount of pouches (+ type)
getBoosters - claim a certain amount of boosters (+ type)
getCoins - earn a certain amount of coins
haveCoins - have a certain amount of coins in your balance
activeBoosts - have a certain amount of boosts active at once [+ type]
getMessageCount - reach a certain amount of messages sent
reachLeaderboard - reach a certain hoist on the leaderboard (+ type)
firstApplication - apply for staff


STRUCTURE OF ACHIEVEMENTS:

type - STRING (above)
data - [{
    name - Name of achievement STRING
    description - Description of achievement STRING
    reward - {
        message: STRING -- REQUIRED if having rewards
        xp: NUMBER(0 if no XP)
        coins: NUMBER(0 if no coins)
        inventoryID: [0, 1] etc.(null if not applicable)
    } - null if no reward
    AND ALSO LISTED BELOW
}]

DATA:

== getXP
amount: NUMBER

== getLevel
level: NUMBER

== getCrates
type: STRING (XP, COIN) -- null if not applicable
amount: NUMBER

== getPouches
type: STRING (XP, COIN) -- null if not applicable
amount: NUMBER

== getBoosters
type: STRING (XP, COIN) -- null if not applicable
amount: NUMBER

== getCoins
amount: NUMBER

== haveCoins
amount: NUMBER

== activeBoosts
type: STRING (XP, COIN) -- null if not applicable
amount: NUMBER

== getMessageCount
amount: NUMBER

== reachLeaderboard
type: STRING (XP, COIN, AVGXP, MC) -- null if not applicable
hoist: NUMBER

== firstApplication
null

*/
module.exports = [{
    type: 'getXP',
    data: [{
        name: 'Slow grinding...',
        description: 'Gain a total of 500 XP!',
        amount: 500,
        reward: {
            message: '5x Coins',
            xp: null,
            coins: 5,
            inventoryID: null
        }
    }, {
        name: 'Into the thousands!',
        description: 'Gain a total of 1000 XP!',
        amount: 1000,
        reward: {
            message: '10x Coins',
            xp: null,
            coins: 10,
            inventoryID: null
        }
    }, {
        name: 'Adding zeros are we?',
        description: 'Reach a total of 5000 XP!',
        amount: 5000,
        reward: {
            message: '1x Coin Crate - 25-50 Coins',
            xp: null,
            coins: null,
            inventoryID: [30]
        }
    }, {
        name: 'The tens of thousands range',
        description: 'Reach a total of 10,000 XP!',
        amount: 10000,
        reward: {
            message: '1x Coin Pouch - 50 Coins',
            xp: null,
            coins: null,
            inventoryID: [21]
        }
    }, {
        name: 'Half a hundred thousand???',
        description: 'Reach a total of 50,000 XP!',
        amount: 50000,
        reward: {
            message: '1x XP Booster - +5% (15 min)',
            xp: null,
            coins: null,
            inventoryID: [37]
        }
    }, {
        name: 'The ludicrous 100K',
        description: 'Reach a total of 100,000 XP!',
        amount: 100000,
        reward: {
            message: '1x XP Booster - +10% (15 min)\n1x Coin Booster - +10% (15 min)\n200 Coins\n2000 XP',
            xp: 2000,
            coins: 200,
            inventoryID: [39, 43]
        }
    }, {
        name: 'The Goddess of Experience',
        description: 'Reach a total of 500,000 XP!',
        amount: 500000,
        reward: {
            message: '3x Coin Booster - +10% (15 min)\n3x XP Booster - +10% (15 min)\n5x XP Booster - +2.5% (15 min)\n1x Coin Crate - 500-1000 Coins\n3x XP Crate - 1000-2000 XP\n1x XP Crate - 10-2000 XP',
            xp: null,
            coins: null,
            inventoryID: [43, 43, 43, 39, 39, 39, 36, 36, 36, 36, 36, 34, 14, 14, 14, 15]
        }
    }]
}, {
    type: 'getLevel',
    data: [{
        name: 'Happy first level up!',
        description: 'Reach Level 2',
        level: 2,
        reward: {
            message: '1x XP Pouch - 100 XP',
            xp: null,
            coins: null,
            inventoryID: [4]
        }
    }, {
        name: 'Double diggerydoos',
        description: 'Reach Level 10',
        level: 10,
        reward: {
            message: '60 Coins',
            xp: null,
            coins: 60,
            inventoryID: null
        }
    }, {
        name: 'A double dozen of levels',
        description: 'Reach Level 24',
        level: 24,
        reward: {
            message: '1x Coin Crate - 100-200 Coins',
            xp: null,
            coins: null,
            inventoryID: [32]
        }
    }]
}, {
    type: 'getCrates',
    data: [{
        name: 'What\'s in the mystery box?',
        description: 'Open your first crate.',
        type: 'null',
        amount: 1,
        reward: {
            message: '200 XP',
            xp: 200,
            coins: null,
            inventoryID: null
        }
    }]
}, {
    type: 'getPouches',
    data: [{
        name: 'Cheatin\' XP',
        description: 'Open 10 XP Pouches',
        type: 'XP',
        amount: 10,
        reward: {
            message: '1x Coin Crate - 10-25 Coins',
            xp: null,
            coins: null,
            inventoryID: [29]
        }
    }]
}, {
    type: 'getBoosters',
    data: [{
        name: 'Enhancing the chat 101',
        description: 'Claim your first booster',
        type: 'null',
        amount: 1,
        reward: {
            message: '50 Coins\n1x XP Pouch - 50 XP',
            xp: null,
            coins: 50,
            inventoryID: [3]
        }
    }]
}, {
    type: 'getCoins',
    data: [{
        name: 'Wealthy',
        description: 'Reach a total of 5000 Coins earned',
        amount: 5000,
        reward: {
            message: '1x Coin Booster - +2.5% (15 min)',
            xp: null,
            coins: null,
            inventoryID: [40]
        }
    }]
}, {
    type: 'haveCoins',
    data: [{
        name: 'Why don\'t you spend your coins?',
        description: 'Have 10,000 coins in your balance',
        amount: 10000,
        reward: {
            message: '1000 XP',
            xp: 1000,
            coins: null,
            inventoryID: null
        }
    }]
}, {
    type: 'activeBoosts',
    data: [{
        name: 'Megabooster',
        type: 'null',
        description: 'Have 10 active boosts concurrently boosting',
        amount: 10,
        reward: {
            message: '1x Coin Crate - 100-200 Coins',
            xp: null,
            coins: null,
            inventoryID: [32]
        }
    }]
}, {
    type: 'getMessageCount',
    data: [{
        name: 'Minorly Talkative',
        description: 'Reach 1000 Message Count',
        amount: 1000,
        reward: {
            message: '1x XP Booster - +5% (15 min)\n1x XP Pouch - 500 XP',
            xp: null,
            coins: null,
            inventoryID: [6, 37]
        }

    }]
}, {
    type: 'reachLeaderboard',
    data: [{
        name: 'On the Leaderboard!',
        description: 'Appear on the Leaderboard',
        type: 'null',
        hoist: 9,
        reward: {
            message: '100 Coins',
            xp: null,
            coins: 100,
            inventoryID: null
        }
    }]
}, {
    type: 'firstApplication',
    data: [{
        name: 'The First Submission',
        description: 'Submit your first staff application',
        reward: {
            message: null,
            xp: null,
            coins: null,
            inventoryID: null
        }
    }]
}]
