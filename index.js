const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

//INFORMACJA O ERRORZE (NODEMON)
fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Nie znaleziono zadnych komend");
        return;
    }

    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} has been loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

//LOG W KONSOLI O POMYŚLNYM ZAŁADOWANIU BOTA
bot.on("ready", async () => {
    console.log(`${bot.user.username} has been load without errors!`);
    console.log(`${bot.user.username} is online on ${bot.guilds.size} server`);

    //STATUS "W GRZE"
    bot.user.setActivity("East Los Santos Station", {type: "STREAMING"});
});
//LOG W KONSOLI INFORMUJĄCY O DOŁĄCZENIU NA DISCORDA FRAKCYJNEGO
bot.on("guildMemberAdd", async member => {
    console.log(`${member.displayName} dolaczyl do discorda frakcyjnego.`);
})
//LOG W KONSOLI INFORMUJĄCY O OPUSZCZENIU DISCORDA FRAKCYJNEGO
bot.on("guildMemberRemove", async member => {
    
    console.log(`${member.displayName} opuscil discord frakcyjny.`);

})

bot.on("channelCreate", async channel => {

    console.log(`${channel.name} channel has been created.`);

})

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefixes: botconfig.prefix
        };
    }

    let prefix = prefixes[message.guild.id].prefixes;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args);

});



bot.login(tokenfile.token);