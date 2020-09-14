const { MessageEmbed } = require("discord.js");
const { COLOR } = require("../config.json");
const ms = require("ms");
const discord = require("discord.js");

module.exports = {
    name: "cte",
    description: "Mute someone",
    async execute(client, message, args){
        let embed = new MessageEmbed().setColor(COLOR);

        var user = message.mentions.users.first();
        var member;
        
        if(!user){
            return message.channel.send("Noboy was mentioned");
        }
        try{
            member = await message.guild.members.fetch(user);
        }catch(error){
            member = null;
        }

        var rawTime = args[1];
        var time = ms(rawTime);
        if(!time){
            return message.channel.send("Specify a time");
        }

        var reason = "CTE";
        var channel = message.guild.channels.cache.find(tc => tc.name === 'general');

        embed = new discord.MessageEmbed().setColor(COLOR)
        .setTitle('Be Gone')
        .addField('Expires: ', rawTime, true)
        .addField('Reason', reason, true);

        var role = message.guild.roles.cache.find(r => r.name === 'Muted');
        member.roles.add(role);

        setTimeout(async() => {
            member.roles.remove(role);
        }, time);

        embed.setDescription(`**${user}** has been muted by **${message.author}** for **${rawTime}** due to **${reason}**!`);
        return message.channel.send(embed);
    }
};