// require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
require("dotenv").config(); //to start process from .env file

// create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// when the client is ready, run this code (only once)
// we use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	// creates the howMany slash command that counts the amount of times Nick has joined
	const howMany = new SlashCommandBuilder()
		.setName('howmany')
		.setDescription('Checks how many times Nick has returned');
	const howManyCommand = howMany.toJSON();
	client.application.commands.create(howManyCommand, "748757955679223828");

	// checks if Nick is currently in the server
	const homeh = new SlashCommandBuilder()
		.setName('homeh')
		.setDescription('Is Nick homeh?');
	const homehCommand = homeh.toJSON();
	client.application.commands.create(homehCommand, "748757955679223828");
});

client.on(Events.InteractionCreate, interaction => {
	if(!interaction.isChatInputCommand()) return;
	// handles the howmany command
	if(interaction.commandName === "howmany") {
		// designate welcome channel
		const channel = client.channels.cache.get("821588842858414081");
		// start combing through all the messages and look for join messages from Nick
		// because user sends their own join message
		fetchAllMessages(channel).then(messages => {
			let count = 0;
			function counter(message) {
				const author = message.author
				console.log(message);
				// when the the message sender's id is Nick's and the message type is 7 (type 7 is a join message)
				if (author.id === '303624645532319744' && message.type === 7 ) {
					count += 1;
				}
			}
			console.log(`Received ${messages.size} messages`);
			// check all messages
			messages.forEach(message => counter(message));
			// send reply that says how many times the specified message was found
			interaction.reply(`Nick has returned homeh ${count} times!`);
		  })
	}
	if(interaction.commandName === "homeh") {
		let guild = client.guilds.cache.get('748757955679223828');
		if (guild.members.cache.get('303624645532319744')){
			interaction.reply(`Nick is homeh :)`);
		}
		else {
			interaction.reply(`Nick is not homeh :(`);
		}
	}
})

// log in to Discord with your client's token
client.login(process.env.TOKEN);

async function fetchAllMessages(channel) {
	let messages = [];
  
	// create message pointer
	let message = await channel.messages
	  .fetch({ limit: 1 })
	  .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
  
	while (message) {
	  await channel.messages
		.fetch({ limit: 100, before: message.id })
		.then(messagePage => {
		  messagePage.forEach(msg => messages.push(msg));
  
		  // update our message pointer to be last message in page of messages
		  message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
		})
	}
	return messages;
  }