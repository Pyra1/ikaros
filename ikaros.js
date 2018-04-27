const { Client } = require("discord.js")
const client = new Client({
  autoReconnect: true
})

const config = require('./config.json')

const botver = "1.0"
const embedcolor = 3664891

const randomPuppy = require('random-puppy')

//DBL API Server counter
const { stringify } = require('querystring')
const { request } = require('https')

const update = () => {
  const data = stringify({ server_count: client.guilds.size })
  const req = request({
    host: 'discordbots.org',
    path: `/api/bots/${client.user.id}/stats`,
    method: 'POST',
    headers: {
      'Authorization': 'long-dbl-token',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  })
  req.write(data)
  req.end()
}
//end of DBL API Server counter

client.on('ready', update);
client.on('guildCreate', update);
client.on('guildRemove', update);

client.on("ready", () => {
  console.log(`[Start] ${new Date()} | ${client.guilds.size} guilds`);
  client.user.setPresence({
    afk: false,
    status: "online",
    game: {
      name: client.guilds.size + " servers! | ik.help",
      type: 3
    }
  })
})

client.on("guildCreate", guild => {
  client.user.setPresence({
    afk: false,
    status: "online",
    game: {
      name: client.guilds.size + " servers! | ik.help",
      type: 3
    }
  })
});

client.on("guildDelete", guild => {
  client.user.setPresence({
    afk: false,
    status: "online",
    game: {
      name: client.guilds.size + " servers! | ik.help",
      type: 3
    }
  })
})

client.on('message', async msg => {

  if(msg.author.bot) return

  if(msg.content.indexOf(config.prefix) !== 0) return

  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()



  if (command === 'ping') {
    const m = await msg.channel.send("Pinging...");
    m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if (command === 'info') {
	 msg.channel.send({embed: {
   "title": "Ikaros ver " + botver,
   "description": "by Pyra_",
   "color": embedcolor,
   "footer": {
     "icon_url": client.user.avatarURL
   },
   "thumbnail": {
     "url": client.user.avatarURL
   },
   "author": {
     "name": "Info",
     "icon_url": client.user.avatarURL
   },
   "fields": [
     {
       "name": "Example Command",
       "value": "-ping"
     },
     {
       "name": "Framework",
       "value": "Discord.js 11.3.0 | Node.js 8.11.0"
     }
    ]
  }})
  }

  if (command === 'help') {
	msg.channel.send("Check your dms!");
    msg.author.send({embed: {
        color: embedcolor,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL,
        },
        title: "Help",
        fields: [
          {
            name: "ik.info",
            value: "Gets info about the bot."
          },
          {
            name: "ik.ping",
            value: "Useful for seeing if the bot is still alive!"
          },
          {
            name: "ik.rate",
            value: "Rate whatever you like"
          },
          {
            name: "ik.say",
            value: "Say whatever you would like Ikaros to say!"
          },
          {
            name: "ik.8ball",
            value: "The 8ball will tell you the truth."
          },
          /*{
            name: "ik.reddit",
            value: "Fetch a random image from the subreddit provided."
          },*/
          {
            name: "ik.meme",
            value: "Get some dank memes!"
          },
          {
            name: "ik.boobs",
            value: "Gets a picture of boobs, only works in nsfw text channels."
          },
          {
            name: "ik.ass",
            value: "Gets a picture of boobs, only works in nsfw text channels."
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "Ikaros ver " + botver
        }
      }
    });
    }

  if (command === 'eval') {
    if(message.author.id !== config.ownerid) return;

    const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
    }

    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      msg.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }

  if (command === 'rate') {
  	var suffixrate = args.join(" ");
  	if (suffixrate) {
  	var num = Math.floor(Math.random() * 101);
  	msg.reply('I rate ' + suffixrate + ': ' + num + '/100');
    }
  }

  if (command === "say") {
    const sayMessage = args.join(" ")
    msg.delete().catch(O_o=>{})
    msg.channel.send(sayMessage)
  }

  if (command === "8ball") {
  	var suffix8ball = args.join(" ")
  	var results = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Sings point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"]
  	var rng = Math.floor(Math.random() * 20)
  	msg.reply("asks, " + "*" + suffix8ball + "*\n" + "```" + results[rng] + "```")
  }

  if (command === "meme") {
    randomPuppy("dankmemes")
      .then(url => {
    		msg.reply(url);
    })
  }

  /*if (command === 'reddit') {
    var suffixreddit = args.join(" ");
   	if(suffixreddit) {
   		randomPuppy(suffixreddit)
		    .then(url => {
        	msg.reply(url);
    })
	 }
 }

//nsfw commands
  if (command === "boobs") {
    if (msg.channel.nsfw === false) {
    return msg.reply("To use this command, you must be in a NSFW text channel.");
  } else {
    randomPuppy("BustyPetite")
  	.then(url => {
      msg.reply(url);
    })
  }
}

if (command === "ass") {
  if (msg.channel.nsfw === false) {
  return msg.reply("To use this command, you must be in a NSFW text channel.");
} else {
  randomPuppy("ass")
  .then(url => {
    msg.reply(url);
  })
}
}

});

client.login(config.token);
