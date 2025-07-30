import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { db } from "../../firbaseConfig";

module.exports = {
  data: new SlashCommandBuilder()
  .setName('set-vc')
  .setDescription('Set in which VC do you want the bot to sit in and Watch.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption(option => 
    option.setName('vc')
    .setDescription('Input the VC you want me to join.')
    .setRequired(true)
    .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
  ),

  async execute(interaction: any): Promise<void> {
    try {
      await interaction.deferReply();
      const GuildID = interaction.guild?.id;
      const vcID = interaction.options.getChannel('vc')?.id;
      const GuildRef = db.ref(`${GuildID}`);
      const data = { vc: vcID };

      await GuildRef.update(data);

      await interaction.editReply('VC Successfully set!');
      
    } catch (error) {
      interaction.reply('An error occured :( Try again later')
      console.log(error)
    }
  }
}

