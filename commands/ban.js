const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Banir player'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId("AddBan")
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

        const banReasonInput = new TextInputBuilder()
			.setCustomId("banReasonInput")
			.setLabel("Motivo")
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder('Anti-RP')
			.setRequired(true);

        const discordAutoBanInput = new TextInputBuilder()
			.setCustomId("discordAutoBanInput")
			.setLabel("Auto-Ban no Discord? [S = SIM  / N = NÃO]")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('S  ou  N')
            .setValue('N')
			.setRequired(true);

		const fivemPlayerIdRow = new ActionRowBuilder().addComponents(fivemPlayerIdInput);
		const discordPlayerIdRow = new ActionRowBuilder().addComponents(discordPlayerIdInput);
		const banReasonRow = new ActionRowBuilder().addComponents(banReasonInput);
		const discordAutoBanRow = new ActionRowBuilder().addComponents(discordAutoBanInput);

		modal.addComponents(fivemPlayerIdRow, discordPlayerIdRow, banReasonRow, discordAutoBanRow);
		await interaction.showModal(modal);
	},
};