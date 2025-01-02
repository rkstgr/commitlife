import { type ActionFunction } from "@remix-run/node";
import { createActivity } from "~/lib/activity.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const title = formData.get("title");
  const targetRecurrence = formData.get("targetRecurrence");

  if (!title || !targetRecurrence) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const activity = await createActivity({
    title: title.toString(),
    targetRecurrence: targetRecurrence.toString(),
  });

  return Response.json(activity);
};
