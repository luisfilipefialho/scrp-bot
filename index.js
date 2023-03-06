const mariadb = require('mariadb');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, requiredRole } = require('./config.json');

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
	host: 'localhost', 
	user:'root', 
	password: '',
	database: 'scrp',
});

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	// Check if the interaction is a command
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
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}

	// Check if the interaction is a modal submission
	if (interaction.isModalSubmit()) {

		switch (interaction.customId) {

			case 'AddWhitelist':
				const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
				const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
				let conn;

				try {
					conn = await pool.getConnection();
					const res = await conn.query(`UPDATE vrp_users SET whitelisted = 1 WHERE id = ${fivemPlayerId}`)
				
					console.log({ fivemPlayerId, discordPlayerId });

					const embed = new EmbedBuilder()
					.setTitle('**Player Aprovado ✅**')
					.setDescription(`
						ID: ${fivemPlayerId}
						Player: <@${discordPlayerId}>
						Aprovador: ${interaction.member}`)
					.setColor('#0cad00');
	
					await interaction.reply({ embeds: [embed]});
				} catch (error) {
					throw err;
				} finally {
					if (conn) return conn.end();
				}
				break;
		}

		
	}
});

client.login(token);