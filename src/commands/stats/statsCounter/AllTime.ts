import { EmbedBuilder } from "discord.js";
import { getFormattedDate } from "../../../config";
import { db } from "../../../firbaseConfig";

interface Session {
  Activities: Record<string, number>;
  joinedAt: number;
  leftAt: number;
}

export async function allTime(memberID: number, user:any): Promise<any> {
  try {
    const data: Record<string, number> = {};

    const userRef = db.ref(`Users/${memberID}`);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) return { 'err': 404 }

    const dayData = snapshot.val() || {};

    for (const [date, sessions] of Object.entries(dayData)) {
      for (const session of Object.values(sessions as Record<string, Session>)) {
        for (const [activity, seconds] of Object.entries(session.Activities)) {
          if (typeof seconds === 'number') {
            data[activity] = (data[activity] || 0) + seconds;
          }
        }
      }
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle("📊 All time Activity Summary")
      .setAuthor({
        name: user?.username || 'User',
        iconURL: user?.displayAvatarURL() || undefined
      })
      .setTimestamp();

    for (const [activity, seconds] of Object.entries(data)) {
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
    console.log(error)
    return { 'err': 401 }
  }
}