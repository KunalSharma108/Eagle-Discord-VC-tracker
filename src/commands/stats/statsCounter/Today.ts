import { EmbedBuilder } from "discord.js";
import { getFormattedDate } from "../../../config";
import { db } from "../../../firbaseConfig";

interface Session {
  Activities: Record<string, number>;
  joinedAt: number;
  leftAt: number;
}

export async function today(memberID: number, user: any): Promise<any> {
  try {

    const formattedDate = await getFormattedDate();
    const userRef = db.ref(`Users/${memberID}/${formattedDate}`);

    const snapshots = await userRef.once('value');

    if (!snapshots.exists()) return { 'err': 404 };


    const data: Session[] = Object.values(snapshots.val());
    const activityTime: Record<string, number> = {}

    data.forEach((session): void => {
      let k: string;
      let v: unknown;
      for ([k, v] of Object.entries(session.Activities)) {
        if (typeof v === 'number') {
          if (k in activityTime) {
            activityTime[k] += v;
          } else {
            activityTime[k] = v;
          }
        }
      }
    });

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle("📊 Today's Activity Summary")
      .setAuthor({
        name: user?.username || 'User',
        iconURL: user?.displayAvatarURL() || undefined
      })
      .setTimestamp();

    for (const [activity, seconds] of Object.entries(activityTime)) {
      const minutes = Math.floor(seconds / 60);
      const remainingSec = seconds % 60;

      embed.addFields({
        name: `${activity}`,
        value: `\`${minutes}m ${remainingSec}s\``,
        inline: false,
      });
    }

    return embed

  } catch (error) {
    console.log('there was an error:', error);
    return { 'err': 1 }
  }
}
