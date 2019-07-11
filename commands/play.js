module.exports = class play {
    constructor() {
        this.name = 'play',
        this.alias = [],
        this.usage = '-play <song>',
        this.category = 'music',
        this.description = 'Queue a song to play'
    }

    play(client, guild, song) {
        let serverQueue = client.music.queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            client.music.queue.delete(guild.id);
            return;
        }
        console.log(serverQueue.songs);
        const dispatcher = serverQueue.connection.play(client.modules.ytdl(song.url))
            .on('end', reason => {
                if (reason === 'Stream is not generating quickly enough') console.log('Song ended');
                else console.log(reason);
                serverQueue.songs.shift();
                this.play(client, guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`${client.storage.emojiCharacters['music']} Now playing: **${song.title}**`);
    }

    async handleVideo(client, video, msg, voiceChannel, playlist = false) {
        let serverQueue = client.music.queue.get(msg.guild.id);
        console.log(video);
        const song = {
            id: video.id,
            title: client.modules.Discord.Util.escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            client.music.queue.set(msg.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                this.play(client, msg.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                client.music.queue.delete(msg.guild.id);
                return msg.channel.send(`I could not join the voice channel: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            if (playlist) return undefined;
            else return msg.channel.send(`${client.storage.emojiCharacters['white_check_mark']} **${song.title}** has been added to the queue!`)
        }
        return undefined;
    }

    async run(client, message, args) {
        let query = message.content.slice(args[0].length + 1),
            url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '',
            queue = client.music.queue.get(message.guild.id),
            voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(`You must be in a voice channel to play music!`);
        if (!voiceChannel.permissionsFor(client.user).has('CONNECT')) return message.channel.send(`I cannot connect to the voice channel you are currently in!`);
        if (!voiceChannel.permissionsFor(client.user).has('SPEAK')) return message.channel.send(`I cannot play music because I cannot speak in your voice channel!`);
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            let playlist = await client.music.YouTube.getPlaylist(url);
            let videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                let video2 = await client.music.YouTube.getVideoByID(video.id);
                await this.handleVideo(client, video2, message, voiceChannel, true);
            }
            let embed = new client.modules.Discord.MessageEmbed()
                .setColor(message.guild.member(client.user).displayHexColor)
                .setDescription(`${client.storage.emojiCharacters['white_check_mark']} Added the playlist **${playlist.title}** to the queue!`)
            return message.channel.send(embed);
        } else {
            try {
                var video = await client.music.YouTube.getVideo(url)
            } catch (error) {
                try {
                    var videos = await client.music.YouTube.searchVideos(query, 10);
                    let index = 0;
                    message.channel.send(new client.modules.Discord.MessageEmbed()
                        .setColor(message.guild.member(client.user).displayHexColor)
                        .setFooter(`Please send a value between 1 and 10`)
                        .addField(`Songs:`, videos.map(video2 => `**${++index} -** ${video2.title}`).join(`\n`))
                    );
                    try {
                        var response = await message.channel.awaitMessages(msg2 => (msg2.content >= 1) && (msg2.content <= 10), {
                            max: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.error(err);
                        return message.channel.send(`No or invalid value sent. I have cancelled the video selection.`);
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await client.music.YouTube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send(`${client.storage.emojiCharacters['x']} Unfortunately, I could not obtain any search results.`);
                }
            }
            return this.handleVideo(client, video, message, voiceChannel);
        }
    }
}