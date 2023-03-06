const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unwl')
		.setDescription('Remove o player da Whitelist'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId("RemWhitelist")
			.setTitle("Remover Whitelist")

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

		const fivemPlayerIdRow = new ActionRowBuilder().addComponents(fivemPlayerIdInput);
		const discordPlayerIdRow = new ActionRowBuilder().addComponents(discordPlayerIdInput);

		modal.addComponents(fivemPlayerIdRow, discordPlayerIdRow);
		await interaction.showModal(modal);
	},
};