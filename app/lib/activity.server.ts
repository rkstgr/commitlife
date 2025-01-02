// app/lib/activity.server.ts
import { db } from "./db.server";
import { startOfYear, endOfYear } from "date-fns";

export async function getActivities() {
  const currentYear = new Date().getFullYear();
  return db.activity.findMany({
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
  title,
  targetRecurrence,
}: {
  title: string;
  targetRecurrence: string;
}) {
  return db.activity.create({
    data: {
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
