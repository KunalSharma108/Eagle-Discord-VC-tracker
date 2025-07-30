import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { today } from "./statsCounter/Today";
import { past3Days } from "./statsCounter/Past3Days";
import { past7Days } from "./statsCounter/Past7Days";
import { pastMonth } from "./statsCounter/PastMonth";
import { past3Months } from "./statsCounter/Past3Months";
import { pastYear } from "./statsCounter/PastYear";
import { allTime } from "./statsCounter/AllTime";

export async function sendLoadingLoop(interaction: CommandInteraction): Promise<() => void> {
  const dots = ['...', '..', '.'];
  let index = 0;

  await interaction.editReply({ content: `⏳ Gathering data${dots[index]}` });

  const interval = setInterval(async () => {
    index = (index + 1) % dots.length;
    try {
      await interaction.editReply({ content: `⏳ Gathering data${dots[index]}` });
    } catch (e) {
      clearInterval(interval);
    }
  }, 800); // every 800ms

  // Return a function to stop the loop
  return () => clearInterval(interval);
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get statistics of your work.')
    .addStringOption(Option =>
      Option
        .setName('duration')
        .setDescription('Set a time range.')
        .addChoices(
          { name: 'today', value: 'today' },
          { name: 'past 3 days', value: 'past_3_days' },
          { name: 'past 7 days', value: 'past_7_days' },
          { name: 'past month', value: 'past_month' },
          { name: 'past 3 months', value: 'past_3_months' },
          { name: 'past year', value: 'past_year' },
          { name: 'all time', value: 'all_time' }
        )
    ),
  async execute(interaction: any): Promise<void> {
    try {

      await interaction.deferReply();
      const stopLoading = await sendLoadingLoop(interaction);

      const memberID: number = eval(interaction.user?.id);
      const durationChoice: String = interaction.options.getString('duration');
      const user: any = interaction.member?.user;

      switch (durationChoice) {
        case 'today':
          let embed: any = await today(memberID, user);

          if (embed.err) {
            if (embed.err == 404) {
              stopLoading();
              await interaction.editReply('Today\'s data does not exist. \n`May be because of the timezones. Try doing past 3 days` ');
              break;
            } else {
              stopLoading();
              await interaction.editReply('There was an error 😞');
              break;
            }
          }

          stopLoading();
          await interaction.editReply({ content: null, embeds: [embed] });
          break;

        case 'past_3_days':
          let Past3Days_Embed: any = await past3Days(memberID, user);

          if (Past3Days_Embed.err) {
            if (Past3Days_Embed.err == 404) {
              stopLoading();
              await interaction.editReply('past 3 days data does not exist.');
              break;
            } else {
              stopLoading();
              await interaction.editReply('There was an error 😞');
              break;
            }
          }

          stopLoading();
          await interaction.editReply({ content: null, embeds: [Past3Days_Embed] });
          break;

        case 'past_7_days':
          let Past7Days_Embed: any = await past7Days(memberID, user);

          if (Past7Days_Embed.err) {
            if (Past7Days_Embed.err == 404) {
              stopLoading();
              await interaction.editReply('past 7 days data does not exist.');
              break;
            } else {
              stopLoading();
              await interaction.editReply('There was an error 😞');
              break;
            }
          }

          stopLoading();
          await interaction.editReply({ content: null, embeds: [Past7Days_Embed] });
          break;

        case 'past_month':
          let pastMonth_Embed: any = await pastMonth(memberID, user);

          if (pastMonth_Embed.err) {
            if (pastMonth_Embed.err == 404) {
              stopLoading();
              await interaction.editReply('past month\'s data does not exist.');
              break;
            } else {
              stopLoading();
              await interaction.editReply('There was an error 😞');
              break;
            }
          }

          stopLoading();
          await interaction.editReply({ content: null, embeds: [pastMonth_Embed] });
          break;

        case 'past_3_months':
          let past3Months_Embed: any = await past3Months(memberID, user);

          if (past3Months_Embed.err) {
            if (past3Months_Embed.err == 404) {
              stopLoading();
              await interaction.editReply('past 3 months\' data does not exist.');
              break;
            } else {
              stopLoading();
              await interaction.editReply('There was an error 😞');
              break;
            }
          }

          stopLoading();
          await interaction.editReply({ content: null, embeds: [past3Months_Embed] });
          break;

        case 'past_year':
          let pastYear_Embed: any = await pastYear(memberID, user);

          if (pastYear_Embed.err) {
            if (pastYear_Embed.err == 404) {
              stopLoading();
              await interaction.editReply('past year\'s data does not exist.');
              break;
            } else {
              stopLoading();
              await interaction.editReply('There was an error 😞');
              break;
            }
          }

          stopLoading();
          await interaction.editReply({ content: null, embeds: [pastYear_Embed] });
          break;

        case 'all_time':
          let allTime_Embed: any = await allTime(memberID, user);
          if (allTime_Embed.err) {
            if (allTime_Embed.err == 404) {
              stopLoading();
              await interaction.editReply('all time data does not exist.');
              break;
            } else {
              stopLoading();
              await interaction.editReply('There was an error 😞');
              break;
            }
          }

          stopLoading();
          await interaction.editReply({ content: null, embeds: [allTime_Embed] });
          break;

        default:
          stopLoading();
          await interaction.editReply({ content: 'There was an error!', ephemeral: true })
          break;
      }
    } catch (error) {
      console.log(error)
      await interaction.editReply('There was an error while executing this command!')
    }
  }
}