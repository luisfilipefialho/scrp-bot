const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('group')
		.setDescription('Adicionar/Alterar Grupo (job)'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId("AddGroup")
			.setTitle("Alterar Grupo")

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

        const groupInput = new TextInputBuilder()
			.setCustomId("groupInput")
			.setLabel("Grupo")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Civil')
			.setRequired(true);

		const fivemPlayerIdRow = new ActionRowBuilder().addComponents(fivemPlayerIdInput);
		const discordPlayerIdRow = new ActionRowBuilder().addComponents(discordPlayerIdInput);
		const groupRow = new ActionRowBuilder().addComponents(groupInput);

		modal.addComponents(fivemPlayerIdRow, discordPlayerIdRow, groupRow);
		await interaction.showModal(modal);
	},
};