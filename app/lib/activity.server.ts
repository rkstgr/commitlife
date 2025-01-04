// app/lib/activity.server.ts
import { db } from "./db.server";
import { startOfYear, endOfYear } from "date-fns";

export async function getActivities(userId: string) {
  const currentYear = new Date().getFullYear();
  return db.activity.findMany({
    where: {
      userId: userId,
    },
    include: {
      commits: {
        where: {
          datetime: {
            gte: startOfYear(new Date(currentYear, 0, 1)),
            lte: endOfYear(new Date(currentYear, 11, 31)),
          },
        },
      },
    },
  });
}

export async function createActivity({
  userId,
  title,
  targetRecurrence,
}: {
  userId: string;
  title: string;
  targetRecurrence: string;
}) {
  return db.activity.create({
    data: {
      userId,
      title,
      targetRecurrence,
    },
  });
}

export async function createCommit(activityId: string) {
  return db.commit.create({
    data: {
      activityId,
      datetime: new Date(),
    },
  });
}
