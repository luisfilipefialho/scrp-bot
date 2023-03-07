const mariadb = require('mariadb');
const fs = require('node:fs');
const path = require('node:path');
const handlers = require('./handler')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, requiredRole, requiredChannel, db_host, db_user, db_password, db_name } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const pool = mariadb.createPool({
	host: db_host, 
	user: db_user, 
	password: db_password,
	database: db_name,
});

client.once(Events.ClientReady, () => {
	console.clear();
	console.log(`\n		   \x1b[32mBot \x1b[32;1;3;4mONLINE\x1b[0m
  \x1b[0mQualquer duvida entre em contato, \x1b[33m1nsend#8207\x1b[0m.`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.channelId !== requiredChannel) return;

	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		const member = interaction.member;
		if (!member.roles.cache.has(requiredRole)) {
		  await interaction.reply({ content: 'Você não possui permissão para usar esse comando.', ephemeral: true });
		  return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: `Erro ao executar este comando: ${error.message}`, ephemeral: true });
			} else {
				await interaction.reply({ content: `Erro ao executar este comando: ${error.message}`, ephemeral: true });
			}
		}
	}

	if (interaction.isModalSubmit()) {
		if (interaction.customId) handlers[interaction.customId](interaction, pool)
	}
});

client.login(token);