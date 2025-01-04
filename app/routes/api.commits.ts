import { type ActionFunction } from "@remix-run/node";
import { set } from "date-fns";
import { db } from "~/lib/db.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const date = formData.get("date");
  const activityId = formData.get("activityId");

  if (!activityId) {
    return Response.json({ error: "Missing activityId" }, { status: 405 });
  }

  if (request.method === "DELETE") {
    const { count } = await db.commit.deleteMany({
      where: {
        datetime: set(new Date(date as string), {
          hours: 12,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }),
        activityId: activityId as string,
      },
    });
    return Response.json({ success: true, count });
  }

  if (request.method === "POST") {
    const commit = await db.commit.create({
      data: {
        datetime: set(date ? new Date(date as string) : new Date(), {
          hours: 12,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }),
        activityId: activityId as string,
      },
    });
    return Response.json({ commit });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};
