module.exports = (client) => {
    console.log(`[LOG] Bot successfully initialized:`);
    console.log(`- Username: ${client.user.username}`);
    console.log(`- Discriminator: ${client.user.discriminator}`);
    console.log(`- ID: ${client.user.id}`);
    let ip = "unitedrealm.co.uk";
    let port = "25565";
    let url = 'http://mcapi.us/server/status?ip=' + ip + '&port=' + port;

    function update() {
        client.modules.request(url, function (err, response, body) {
            if (err) console.error(err);
            body = JSON.parse(body);
            if (body.online) {
                if (body.players.now >= body.players.max) {
                    client.user.setActivity(`the max amount of players! ${body.players.now}/${body.players.max}`, {
                        type: 'WATCHING'
                    }).then(presence => console.log(`- Activity: ${presence.activity.name}`)).catch(err => console.error(err));
                } else {
                    if (body.players.now < 1) {
                        client.user.setPresence({
                            status: 'idle',
                            activity: {
                                name: `${body.players.now} players on ${ip}!`
                            }
                        }).then(presence => console.log(`- Activity: ${presence.activity.name} + IDLE`)).catch(err => console.error(err));
                    } else {
                        client.user.setActivity(`${body.players.now} players on ${ip}!`, {
                            type: 'WATCHING'
                        }).then(presence => console.log(`- Activity: ${presence.activity.name}`)).catch(err => console.error(err));
                    }
                }
            } else {
                client.user.setPresence({
                    status: 'dnd',
                    activity: {
                        name: `The server currently isn't online!`
                    }
                }).then(presence => console.log(`- Activity: ${presence.activity.name}`)).catch(err => console.error(err));
            }
        });
    }
    update();
    client.setInterval(update, 30000);
}