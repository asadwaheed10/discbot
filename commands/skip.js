const { MessageEmbed } = require("discord.js")
const { COLOR } = require("../config.json");

module.exports = {
  name: "skip",
  description: "Skip the song",
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
        embed.setAuthor("There was nothing to be skipped!");
        return message.channel.send(embed);
    }else{
        serverQueue.connection.dispatcher.end();
    }
  }
};