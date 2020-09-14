const discord = require("discord.js")
const client = new discord.Client();
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./config.json") //Storing information in a different json file 

//CLIENT EVENTS
client.on("ready", () => {
  console.log('NoodleBot is Online!');
})

client.commands = new discord.Collection();
client.queue = new Map();

//LOADING IN ALL THE FILES NEEDED
const commandFiles = readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//WHERE THE BOT WILL RECOGNIZE A COMMAND GIVEN BY A USER
client.on("message", message => {
    if(!message.content.startsWith(PREFIX) || message.author.bot)
        return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/) //removing prefix from args
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)){
        return;
    }

//ATTEMPTS TO EXECUTE THE COMMAND GIVEN BY THE USER
    try{
        client.commands.get(command).execute(client, message, args);
    }catch(error){
        console.log(error);
        message.reply("There was an error using this command");
    }
});

client.login(TOKEN);