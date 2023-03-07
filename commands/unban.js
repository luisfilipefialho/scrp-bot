const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Desbanir player'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId("RemBan")
			.setTitle("Banir Player")

		const fivemPlayerIdInput = new TextInputBuilder()
			.setCustomId("fivemPlayerIdInput")
			.setLabel("FiveM ID")
			.setStyle(TextInputStyle.Short)
			.setMaxLength(4)
			.setMinLength(1)
			.setPlaceholder('Insira o ID do Player no FiveM!')
			.setRequired(true);

		const discordPlayerIdInput = new TextInputBuilder()
			.setCustomId("discordPlayerIdInput")
			.setLabel("Discord ID")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Insira o ID do Discord do player!')
			.setRequired(true);

        const unbanReasonInput = new TextInputBuilder()
			.setCustomId("unbanReasonInput")
			.setLabel("Motivo")
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder('Lei do Perdão')
			.setRequired(true);

		const fivemPlayerIdRow = new ActionRowBuilder().addComponents(fivemPlayerIdInput);
		const discordPlayerIdRow = new ActionRowBuilder().addComponents(discordPlayerIdInput);
		const unbanReasonRow = new ActionRowBuilder().addComponents(unbanReasonInput);

		modal.addComponents(fivemPlayerIdRow, discordPlayerIdRow, unbanReasonRow);
		await interaction.showModal(modal);
	},
};