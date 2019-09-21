// all items must include:
// id - number
// name - string
// desc - string
// usable - boolean
// type - number
// reward - object in array (IF APPLICABLE TO ITEM) -- THIS IS NOT READ IF USABLE IS FALSE
//
// Available types:
// 1 => Role
// 2 => Pouch
// 3 => Crate
// 4 => Booster
module.exports = [{
    id: 1,
    name: 'VIP Role',
    desc: 'A role that gains you access to the VIP Hub, customisable role colours and more...',
    usable: true,
    type: 1,
    reward: [{
        role_name: 'VIP'
    }]
}, {
    id: 2,
    name: 'XP Pouch - 10 XP',
    desc: 'A claimable pouch that gives you 10 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 10
    }]
}, {
    id: 3,
    name: 'XP Pouch - 50 XP',
    desc: 'A claimable pouch that gives you 50 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 50
    }]
}, {
    id: 4,
    name: 'XP Pouch - 100 XP',
    desc: 'A claimable pouch that gives you 100 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 100
    }]
}, {
    id: 5,
    name: 'XP Pouch - 250 XP',
    desc: 'A claimable pouch that gives you 250 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 250
    }]
}, {
    id: 6,
    name: 'XP Pouch - 500 XP',
    desc: 'A claimable pouch that gives you 500 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 500
    }]
}, {
    id: 7,
    name: 'XP Pouch - 1000 XP',
    desc: 'A claimable pouch that gives you 1000 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 1000
    }]
}, {
    id: 8,
    name: 'XP Pouch - 2000 XP',
    desc: 'A claimable pouch that gives you 2000 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 2000
    }]
}, {
    id: 9,
    name: 'XP Crate - 10-50 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 10 and 50',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 10,
        high: 50
    }]
}, {
    id: 10,
    name: 'XP Crate - 50-100 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 50 and 100',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 50,
        high: 100
    }]
}, {
    id: 11,
    name: 'XP Crate - 100-250 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 100 and 250',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 100,
        high: 250
    }]
}, {
    id: 12,
    name: 'XP Crate - 250-500 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 250 and 500',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 250,
        high: 500
    }]
}, {
    id: 13,
    name: 'XP Crate - 500-1000 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 500 and 1000',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 500,
        high: 1000
    }]
}, {
    id: 14,
    name: 'XP Crate - 1000-2000 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 1000 and 2000',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 1000,
        high: 2000
    }]
}, {
    id: 15,
    name: 'XP Crate - 10-2000 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 10 and 2000',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 10,
        high: 2000
    }]
}, {
    id: 16,
    name: 'Coin Pouch - 1 Coin',
    desc: 'A claimable pouch that gives you 1 Coin',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 1
    }]
}, {
    id: 17,
    name: 'Coin Pouch - 2 Coins',
    desc: 'A claimable pouch that gives you 2 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 2
    }]
}, {
    id: 18,
    name: 'Coin Pouch - 5 Coins',
    desc: 'A claimable pouch that gives you 5 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 5
    }]
}, {
    id: 19,
    name: 'Coin Pouch - 10 Coins',
    desc: 'A claimable pouch that gives you 10 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 10
    }]
}, {
    id: 20,
    name: 'Coin Pouch - 25 Coins',
    desc: 'A claimable pouch that gives you 25 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 25
    }]
}, {
    id: 21,
    name: 'Coin Pouch - 50 Coins',
    desc: 'A claimable pouch that gives you 50 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 50
    }]
}, {
    id: 22,
    name: 'Coin Pouch - 100 Coins',
    desc: 'A claimable pouch that gives you 100 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 100
    }]
}, {
    id: 23,
    name: 'Coin Pouch - 200 Coins',
    desc: 'A claimable pouch that gives you 200 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 200
    }]
}, {
    id: 24,
    name: 'Coin Pouch - 500 Coins',
    desc: 'A claimable pouch that gives you 500 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 500
    }]
}, {
    id: 25,
    name: 'Coin Pouch - 1000 Coins',
    desc: 'A claimable pouch that gives you 1000 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 1000
    }]
}, {
    id: 26,
    name: 'Coin Crate - 1-2 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 1 and 2',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 1,
        high: 2
    }]
}, {
    id: 27,
    name: 'Coin Crate - 2-5 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 2 and 5',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 2,
        high: 5
    }]
}, {
    id: 28,
    name: 'Coin Crate - 5-10 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 5 and 10',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 5,
        high: 10
    }]
}, {
    id: 29,
    name: 'Coin Crate - 10-25 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 10 and 25',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 10,
        high: 25
    }]
}, {
    id: 30,
    name: 'Coin Crate - 25-50 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 25 and 50',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 25,
        high: 50
    }]
}, {
    id: 31,
    name: 'Coin Crate - 50-100 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 50 and 100',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 50,
        high: 100
    }]
}, {
    id: 32,
    name: 'Coin Crate - 100-200 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 100 and 200',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 100,
        high: 200
    }]
}, {
    id: 33,
    name: 'Coin Crate - 200-500 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 200 and 500',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 200,
        high: 500
    }]
}, {
    id: 34,
    name: 'Coin Crate - 500-1000 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 500 and 1000',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 500,
        high: 100
    }]
}, {
    id: 35,
    name: 'Coin Crate - 1-1000 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 1 and 1000',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 1,
        high: 1000
    }]
}, {
    id: 36,
    name: 'XP Booster - +2.5% (15 min)',
    desc: 'When claimed, the whole guild will receive +2.5% XP per message',
    usable: true,
    type: 4,
    reward: [{
        type: 'XP',
        percent: 5,
        time: 900000
    }]
}, {
    id: 37,
    name: 'XP Booster - +5% (15 min)',
    desc: 'When claimed, the whole guild will receive +5% XP per message',
    usable: true,
    type: 4,
    reward: [{
        type: 'XP',
        percent: 5,
        time: 900000
    }]
}, {
    id: 38,
    name: 'XP Booster - +7.5% (15 min)',
    desc: 'When claimed, the whole guild will receive +7.5% XP per message',
    usable: true,
    type: 4,
    reward: [{
        type: 'XP',
        percent: 7.5,
        time: 900000
    }]
}, {
    id: 39,
    name: 'XP Booster - +10% (15 min)',
    desc: 'When claimed, the whole guild will receieve +10% per message',
    usable: true,
    type: 4,
    reward: [{
        type: 'XP',
        percent: 10,
        time: 900000
    }]
}, {
    id: 40,
    name: 'Coin Booster - +2.5% (15 min)',
    desc: 'When claimed, the whole guild will receive +2.5% coins when given from a message',
    usable: true,
    type: 4,
    reward: [{
        type: 'COIN',
        percent: 2.5,
        time: 900000
    }]
}, {
    id: 41,
    name: 'Coin Booster - +5% (15 min)',
    desc: 'When claimed, the whole guild will receive +5% coins when given from a message',
    usable: true,
    type: 4,
    reward: [{
        type: 'COIN',
        percent: 5,
        time: 900000
    }]
}, {
    id: 42,
    name: 'Coin Booster - +7.5% (15 min)',
    desc: 'When claimed, the whole guild will receive +7.5% coins when given from a message',
    usable: true,
    type: 4,
    reward: [{
        type: 'COIN',
        percent: 7.5,
        time: 900000
    }]
}, {
    id: 43,
    name: 'Coin Booster - +10% (15 min)',
    desc: 'When claimed, the whole guild will receive +10% coins when given from a message',
    usable: true,
    type: 4,
    reward: [{
        type: 'COIN',
        percent: 10,
        time: 900000
    }]
}, {
    id: 44,
    name: 'XP Pouch - 25 XP',
    desc: 'A claimable pouch that gives you 25 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 25
    }]
}, {
    id: 45,
    name: 'XP Pouch - 75 XP',
    desc: 'A claimable pouch that gives you 75 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 75
    }]
}, {
    id: 46,
    name: 'XP Pouch - 750 XP',
    desc: 'A claimable pouch that gives you 750 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 750
    }]
}, {
    id: 47,
    name: 'XP Pouch - 1500 XP',
    desc: 'A claimable pouch that gives you 1500 XP',
    usable: true,
    type: 2,
    reward: [{
        type: 'XP',
        amount: 1500
    }]
}, {
    id: 48,
    name: 'XP Crate - 1-10 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 1 and 10',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 1,
        high: 10
    }]
}, {
    id: 49,
    name: 'XP Crate - 1-1000 XP',
    desc: 'A crate that when opened gives you a random amount of XP between 1 and 1000',
    usable: true,
    type: 3,
    reward: [{
        type: 'XP',
        low: 1,
        high: 1000
    }]
}, {
    id: 50,
    name: 'Coin Pouch - 75 Coins',
    desc: 'A claimable pouch that gives you 75 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 75
    }]
}, {
    id: 51,
    name: 'Coin Pouch - 350 Coins',
    desc: 'A claimable pouch that gives you 350 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 350
    }]
}, {
    id: 52,
    name: 'Coin Pouch - 750 Coins',
    desc: 'A claimable pouch that gives you 750 Coins',
    usable: true,
    type: 2,
    reward: [{
        type: 'COIN',
        amount: 750
    }]
}, {
    id: 53,
    name: 'Coin Crate - 150-350 Coins',
    desc: 'A crate that when opened gives you a random amount of Coins between 150 and 350',
    usable: true,
    type: 3,
    reward: [{
        type: 'COIN',
        low: 150,
        high: 350
    }]
}, {
    id: 54,
    name: 'XP Booster - +15% (15 min)',
    desc: 'When claimed, the whole guild will receive +15% per message',
    usable: true,
    type: 4,
    reward: [{
        type: 'XP',
        percent: 15,
        time: 900000
    }]
}, {
    id: 55,
    name: 'Coin Booster - +15% (15 min)',
    desc: 'When claimed, the whole guild will receive +15% coins when given from a message',
    usable: true,
    type: 4,
    reward: [{
        type: 'COIN',
        percent: 15,
        time: 900000
    }]
}]
