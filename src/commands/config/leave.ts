import { getVoiceConnection } from "@discordjs/voice";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave-vc')
    .setDescription('Tell the bot to leave the vc')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: any): Promise<void> {
    const GuildID = interaction.guild?.id;

    const connection = getVoiceConnection(GuildID);

    if (!connection) {
      await interaction.reply({content: 'I am not in a VC', ephemeral: true});
    } else {
      connection.destroy();
      await interaction.reply({ content: 'Left the VC!', ephemeral: true });
    }
  }
}