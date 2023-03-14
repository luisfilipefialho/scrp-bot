const { EmbedBuilder } = require('discord.js');
const { logChannel, whitelistedRole, serverGroups } = require('./config.json');

const handlers = {
	"AddWhitelist": async function (interaction, pool) {
		const fivemPlayerName = interaction.fields.getTextInputValue('fivemPlayerNameInput');
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
		const discordMember = await interaction.guild.members.fetch(discordPlayerId);

		let conn;
		try {
			conn = await pool.getConnection();
			await conn.query(`UPDATE vrp_users SET whitelisted = 1 WHERE id = ${fivemPlayerId}`);

			await discordMember.roles.add(whitelistedRole)
			await discordMember.setNickname(`${fivemPlayerName} | ${fivemPlayerId}`);

			const embed = new EmbedBuilder()
				.setTitle('**Whitelist Adicionada ✅**')
				.addFields(
					{ name: 'Discord', value: `<@${discordPlayerId}>` }, 
					{ name: 'ID', value: `${fivemPlayerId}` },
					{ name: 'Staff', value: `${interaction.member}` }
				)
				.setColor('#0cad00');

			await sendLog(interaction, embed);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao adicionar whitelist: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		};
	},

	"RemWhitelist": async function (interaction, pool) {
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
		const discordMember = await interaction.guild.members.fetch(discordPlayerId);

		let conn;
		try {
			conn = await pool.getConnection();
			await conn.query(`UPDATE vrp_users SET whitelisted = ? WHERE id = ?`, [0, fivemPlayerId]);

			await discordMember.roles.remove(whitelistedRole)

			const embed = new EmbedBuilder()
				.setTitle('**Whitelist Removida ⛔**')
				.addFields(
					{ name: 'Discord', value: `<@${discordPlayerId}>` }, 
					{ name: 'ID', value: `${fivemPlayerId}` },
					{ name: 'Staff', value: `${interaction.member}` }
				)
				.setColor('#be0000');

			await sendLog(interaction, embed);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao remover whitelist: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		};
	},

	"AddBan": async function (interaction, pool) {
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
		const banReason = interaction.fields.getTextInputValue('banReasonInput');
		const autoBan = interaction.fields.getTextInputValue('discordAutoBanInput') === "S" ? true : false;
		const bannedPlayerId = await interaction.guild.members.fetch(discordPlayerId);

		let conn;
		try {
			conn = await pool.getConnection();
			await conn.query(`UPDATE vrp_users SET banned = ? WHERE id = ?`, [1, fivemPlayerId]);

			if (autoBan) await interaction.guild.members.ban(bannedPlayerId, {
				reason: `${banReason} | Staff: ${interaction.member.user.username}`
			});

			const embed = new EmbedBuilder()
				.setTitle('**Player Banido ⛔**')
				.addFields(
					{ name: 'Discord', value: `<@${discordPlayerId}>` }, 
					{ name: 'ID', value: `${fivemPlayerId}` },
					{ name: 'Motivo', value: `${banReason}` },
					{ name: 'Staff', value: `${interaction.member}` }
				)
				.setColor('#be0000');

			await sendLog(interaction, embed);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao banir player: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		};
	},

	"RemBan": async function (interaction, pool) {
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
		const unbanReason = interaction.fields.getTextInputValue('unbanReasonInput');

		let conn;
		try {
			conn = await pool.getConnection();
			await conn.query(`UPDATE vrp_users SET banned = ? WHERE id = ?`, [0, fivemPlayerId]);

			const embed = new EmbedBuilder()
				.setTitle('**Player Desbanido ❎**')
				.addFields(
					{ name: 'Discord', value: `<@${discordPlayerId}>` }, 
					{ name: 'ID', value: `${fivemPlayerId}` },
					{ name: 'Motivo', value: `${unbanReason}` },
					{ name: 'Staff', value: `${interaction.member}` }
				)
				.setColor('#0cad00');

			await sendLog(interaction, embed);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao desbanir player: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		};
	},

	"AddGroup": async function (interaction, pool) {
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
		const group = (interaction.fields.getTextInputValue('groupInput')).toLowerCase();
		
		let conn;
		try {

			if (!serverGroups.includes(group)) {
				await interaction.reply({ content: `Grupo inexistente`, ephemeral: true });
                return;
			};

			conn = await pool.getConnection();
			await conn.query(`UPDATE vrp_user_identities SET job = ? WHERE user_id = ?`, [group, fivemPlayerId]);
			
			let playerInfo = await getPlayerInfo(conn, fivemPlayerId);
			const embed = new EmbedBuilder()
				.setTitle('**Grupo Alterado ✅**')
				.addFields(
					{ name: 'Discord', value: `<@${discordPlayerId}>`, inline: true }, 
					{ name: 'ID', value: `${playerInfo.userId}`, inline: true },
					{ name: 'Nome', value: playerInfo.name, inline: true }, 
					{ name: 'Grupo Antigo', value: playerInfo.group, inline: true }, 
					{ name: 'Grupo Novo', value: group, inline: true }, 
					{ name: 'Staff', value: `${interaction.member}` }
				)
				.setColor('#0cad00');

			await sendLog(interaction, embed);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao desbanir player: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		};
	}
};

async function getPlayerInfo(conn, fivemPlayerId) {
	const playerIdentities = await conn.query(`SELECT * FROM vrp_user_identities WHERE user_id =?`, [fivemPlayerId]);
	const player = playerIdentities[0];
	return {
		userId: player.user_id,
		name: `${player.firstname} ${player.name}`,
		group: player.job
	};
};

async function sendLog(interaction, message) {
	const channel = interaction.client.channels.cache.get(logChannel);
	if (!channel) return await interaction.reply('Erro: Canal de Log não encontrado.');
	await channel.send({ embeds: [message] });
	await interaction.reply({ content: `Comando enviado com sucesso.`, ephemeral: true });
};

module.exports = handlers;