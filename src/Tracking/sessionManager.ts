import { Guild, VoiceChannel } from "discord.js";
import { db } from "../firbaseConfig";
import { CLIENT_ID, getFormattedDate } from "../config";
import { client } from "..";

const activeSessions = new Map<string, NodeJS.Timeout>();

const ActivityTracker = new Map<number, {
  joinedAt: number,
  LeftAt: false | number,
  Activities: Record<string, number>,
  GuildID: number,
}
>();

const addActivity = (memberID: number, guildID: number, activity: string, addTime: number) => {
  const session = ActivityTracker.get(memberID);

  if (!session) {
    ActivityTracker.set(memberID, {
      joinedAt: Date.now(),
      LeftAt: false,
      Activities: {
        [activity]: addTime
      },
      GuildID: guildID
    })
  } else {
    if (session.Activities[activity]) {
      session.Activities[activity] += addTime;
    } else {
      session.Activities[activity] = addTime;
    }
    ActivityTracker.set(memberID, session)
  }
}

const PushToFirebase = async (memberID: number, sessionData: any): Promise<void> => {
  const formattedDate = await getFormattedDate();
  const userRef = db.ref(`Users/${memberID}/${formattedDate}`);

  userRef.push(sessionData);
}

client.on('voiceStateUpdate', (oldState, newState) => {
  // user leaves
  if (oldState.channelId && !newState.channelId) {
    const memberID = eval(oldState.id);
    const sessionData = ActivityTracker.get(memberID);

    if (!sessionData) return;

    sessionData.LeftAt = Date.now();

    PushToFirebase(memberID, sessionData);
    ActivityTracker.delete(memberID);
  }
  
  // bot leaves
  if (oldState.member?.user.id === client.user?.id) {
    const guildId = eval(oldState.guild.id);

    for (const [id, data] of ActivityTracker.entries()) {
      // only delete users from same guild
      if (data.GuildID === guildId) {
        data.LeftAt = Date.now();
        PushToFirebase(id, data);
        ActivityTracker.delete(id);
      }
    }
  }
});

export async function trackSession(guild: Guild, vcID: string): Promise<void> {
  try {
    const guildID = eval(guild.id);
    const GuildRef = db.ref(`${guildID}`);

    if (activeSessions.has(guildID)) return;

    const interval = setInterval(() => {
      const vc = guild.channels.cache.get(vcID) as VoiceChannel;

      if (!vc || !vc.isVoiceBased()) {
        clearInterval(interval);
        activeSessions.delete(guildID);
        return;
      }

      for (const [MemberID, Member] of vc.members) {
        if (MemberID == CLIENT_ID) continue;

        const activities: any = Member.presence?.activities;
        for (const activity of activities) {
          if (activity.type == 4) continue;
          addActivity(eval(MemberID), guildID, activity.name, 5);
        }
      }

    }, 5000);

    activeSessions.set(guildID, interval);
  } catch (error) {
    console.log(error)
  }
}