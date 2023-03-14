const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wl')
		.setDescription('Adiciona o player na Whitelist'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId("AddWhitelist")
			.setTitle("Adicionar Whitelist")


		const fivemPlayerNameInput = new TextInputBuilder()
			.setCustomId("fivemPlayerNameInput")
			.setLabel("FiveM Nome")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Nome do Personagem')
			.setRequired(true);

		const fivemPlayerIdInput = new TextInputBuilder()
			.setCustomId("fivemPlayerIdInput")
			.setLabel("FiveM ID")
			.setStyle(TextInputStyle.Short)
			.setMaxLength(4)
			.setMinLength(1)
			.setPlaceholder('ID do Player')
			.setRequired(true);

		const discordPlayerIdInput = new TextInputBuilder()
			.setCustomId("discordPlayerIdInput")
			.setLabel("Discord ID")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('DiscordID do Player')
			.setRequired(true);

		const fivemPlayerNameRow = new ActionRowBuilder().addComponents(fivemPlayerNameInput);
		const fivemPlayerIdRow = new ActionRowBuilder().addComponents(fivemPlayerIdInput);
		const discordPlayerIdRow = new ActionRowBuilder().addComponents(discordPlayerIdInput);

		modal.addComponents(fivemPlayerNameRow, fivemPlayerIdRow, discordPlayerIdRow);
		await interaction.showModal(modal);
	},
};