//REQUIRED CONSTANTS
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const { Util } = require("discord.js");

const { YOUTUBE_API_KEY, QUEUE_LIMIT, COLOR } = require("../config.json");
const ytdl = require("ytdl-core");
const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(YOUTUBE_API_KEY);
const { play } = require("../playing/music.js");

module.exports = {
    name: "play",
    description: "This is a play command",
    async execute(client, message, args){
        let embed = new MessageEmbed().setColor(COLOR);    

        //Checks to see if someone is in the voice channel 
        const { channel } = message.member.voice; 
        if(!channel){
            message.channel.send("You must be in a voice channel.");
            return;
        }

        // Turning the URL into a valid string
        const targetsong = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const urlcheck = videoPattern.test(args[0]);

        //Creating a queue for the music 
        const serverQueue = message.client.queue.get(message.guild.id);
    
        const queueConst = {
          textChannel: message.channel,
          channel,
          connection: null,
          songs: [],
          loop: false,
          volume: 100,
          playing: true
        };
        
        let songInfo = null;
        let song = null;

        if(urlcheck){
            try{
                songInfo = await ytdl.getInfo(args[0]);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url
                }
            }catch(error){
                console.log(error);
            }
        }else{
            try{
                const result = await youtube.searchVideos(targetsong, 1);
                songInfo = await ytdl.getInfo(result[0].url);

                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url
                };
            }catch(error){
                console.log(error);
                if(error.errors[0].domain === "usageLimits"){
                    return message.channel.send("Your API has reached its limits");
                }
            }
        }
        //Checks to see whether queue is under song limit, if it is greater then it won't add the song 
        if(serverQueue){
            if(serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0){
                return message.channel.send(`You can't add songs more than ${QUEUE_LIMIT}`);
            }
            serverQueue.songs.push(song);
            embed.setDescription(`${song.title} has been added to the queue!`);
            return serverQueue.textChannel
            .send(embed)
            .catch(console.error)
        }else{
          queueConst.songs.push(song); //Pushing songs into the queue 
        }

        //If there are no more songs in the voice channel the bot will leave
        if(!serverQueue){
            message.client.queue.set(message.guild.id, queueConst);
        }
        if(!serverQueue){
            try{
                queueConst.connection = await channel.join();
                play(queueConst.songs[0], message);
            }catch(error){
                console.error("Could not join voice channel:  " + error);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel
                .send({
                    embed: {
                        description: "Could not join voice channel: " + error
                    }
                })
                .catch(console.error);
            }
        }
      }
    };