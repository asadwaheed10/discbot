module.exports = {
    name: 'ping',
    description: "This is a ping command!",
    execute(client, message){
        message.channel.send("Pong!");
    }
}