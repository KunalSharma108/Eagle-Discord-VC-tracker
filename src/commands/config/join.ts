import { SlashCommandBuilder } from "discord.js";
import { db } from "../../firbaseConfig";
import { joinVoiceChannel } from "@discordjs/voice"
import { trackSession } from "../../Tracking/sessionManager";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join-vc')
    .setDescription('Tell the bot to join the vc'),

  async execute(interaction: any): Promise<void> {
    try {
      await interaction.deferReply();
      const GuildID = interaction.guild?.id
      const GuildRef = db.ref(`${GuildID}`);

      const snapshots = await GuildRef.orderByChild('vc').once('value');
      if (snapshots.exists()) {
        const guild = interaction.guild;
        const vcID = snapshots.val().vc;
        const channel = guild.channels.cache.get(vcID);

        if (!channel || channel.type !== 2) { // 2 = Voice Channel type in discord.js v14
          return;
        } else {
          const connection = joinVoiceChannel({
            channelId: vcID,
            guildId: GuildID,
            adapterCreator: guild.voiceAdapterCreator,
          });

          await interaction.editReply(`Joined ${channel}`);
          trackSession(interaction.guild, vcID)
        }
      }
    } catch (error) {
      console.log(error)
      interaction.editReply('cant right now')
    }
  }
}
