module.exports = class example {
    constructor() {
        this.name = 'example',
            this.alias = [],
            this.usage = `=example`
    }

    async run(client, message, args) {
        let ec = client.storage.emojiCharacters;
        message.channel.send(`${ec.a} ${ec.b} ${ec.c} ${ec.d} ${ec.e} ${ec.f} ${ec.g} ${ec.h} ${ec.i} ${ec.j} ${ec.k} ${ec.l} ${ec.m} ${ec.n} ${ec.o} ${ec.p} ${ec.q} ${ec.r} ${ec.s} ${ec.t} ${ec.u} ${ec.v} ${ec.w} ${ec.x} ${ec.y} ${ec.z} ${ec[0]} ${ec[1]} ${ec[2]} ${ec[3]} ${ec[4]} ${ec[5]} ${ec[6]} ${ec[7]} ${ec[8]} ${ec[9]} ${ec[10]} ${ec['#']} ${ec['*']} ${ec['!']} ${ec['?']} ${ec['check_mark']} ${ec['x']} ${ec['eyes']} ${ec['white_check_mark']}`);
    }
}