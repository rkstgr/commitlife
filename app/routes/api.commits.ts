import { json, type ActionFunction } from "@remix-run/node";
import { createCommit } from "~/lib/activity.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const activityId = formData.get("activityId");

  if (!activityId) {
    return json({ error: "Missing activityId" }, { status: 400 });
  }

  const commit = await createCommit(activityId.toString());
  return json({ commit });
};
