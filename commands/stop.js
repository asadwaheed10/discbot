const  { MessageEmbed }  = require("discord.js")
const  { COLOR }  = require("../config.json");
const discord = require("discord.js");

module.exports = {
    name : "stop",
    description : "Stops the music",

    async execute(client, message, args){
        let embed = new MessageEmbed()
        .setColor(COLOR);

        const vc = message.member.voice;

        if(!vc){
            embed.setAuthor("You need to be in the voice channel!");
            return message.channel.send(embed);
        }

        const serverQueue = message.client.queue.get(message.guild.id);

        if(!serverQueue){
            embed.setAuthor("There is nothing to stop playing!");
            return message.channel.send(embed);
        }

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
};