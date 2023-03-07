const { EmbedBuilder } = require('discord.js');

const handlers = {
	"AddWhitelist": async function(interaction, pool) {
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
	
		let conn;
		try {
			conn = await pool.getConnection();
			await conn.query(`UPDATE vrp_users SET whitelisted = 1 WHERE id = ${fivemPlayerId}`);
	
			const embed = new EmbedBuilder()
			.setTitle('**Whitelist Adicionada ✅**')
			.setDescription(`
				ID: ${fivemPlayerId}
				Player: <@${discordPlayerId}>
				Staff: ${interaction.member}
			`)
			.setColor('#0cad00');
	
			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao adicionar whitelist: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		}
	},

    "RemWhitelist": async function(interaction, pool) {
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
		
		let conn;
		try {
			conn = await pool.getConnection();
	
			await conn.query(`UPDATE vrp_users SET whitelisted = ? WHERE id = ?`, [0, fivemPlayerId])
		
			const embed = new EmbedBuilder()
				.setTitle('**Whitelist Removida ⛔**')
				.setDescription(`
					ID: ${fivemPlayerId}
					Player: <@${discordPlayerId}>
					Staff: ${interaction.member}`)
				.setColor('#be0000');
	
			await interaction.reply({ embeds: [embed]});
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao remover whitelist: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		}
	},

	"AddBan": async function(interaction, pool) {
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
		const banReason = interaction.fields.getTextInputValue('banReasonInput');
		const autoBan = interaction.fields.getTextInputValue('discordAutoBanInput') === "S" ? true : false;
		const bannedPlayerId = await interaction.guild.members.fetch(discordPlayerId);
		
		let conn;
		try {
			conn = await pool.getConnection();
	
			await conn.query(`UPDATE vrp_users SET banned = ? WHERE id = ?`, [1, fivemPlayerId])
		
			if (autoBan) await interaction.guild.members.ban(bannedPlayerId, { reason: `${banReason} | Staff: ${interaction.member.user.username}` });

			const embed = new EmbedBuilder()
				.setTitle('**Player Banido ⛔**')
				.setDescription(`
					ID: ${fivemPlayerId}
					Player: <@${discordPlayerId}>
					Motivo: ${banReason}
					Staff: ${interaction.member}`)
				.setColor('#be0000');
	
			await interaction.reply({ embeds: [embed]});
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao banir player: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		}
	},

	"RemBan": async function(interaction, pool) {
		const fivemPlayerId = interaction.fields.getTextInputValue('fivemPlayerIdInput');
		const discordPlayerId = interaction.fields.getTextInputValue('discordPlayerIdInput');
		const unbanReason = interaction.fields.getTextInputValue('unbanReasonInput');

		let conn;
		try {
			conn = await pool.getConnection();
	
			await conn.query(`UPDATE vrp_users SET banned = ? WHERE id = ?`, [0, fivemPlayerId])
		
			const embed = new EmbedBuilder()
				.setTitle('**Player Desbanido ❎**')
				.setDescription(`
					ID: ${fivemPlayerId}
					Player: <@${discordPlayerId}>
					Motivo: ${unbanReason}
					Staff: ${interaction.member}`)
				.setColor('#0cad00');
	
			await interaction.reply({ embeds: [embed]});
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro ao desbanir player: ${error.message}`, ephemeral: true });
		} finally {
			if (conn) conn.end();
		}
	}
}

module.exports = handlers;