import { type ActionFunction } from "@remix-run/node";
import { createActivity } from "~/lib/activity.server";
import { sessionStorage } from "~/services/session.server";

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

  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const sessionUser = session.get("user");
  if (!sessionUser) {
    return Response.json(
      { error: "You have to be logged in to create an activity" },
      { status: 405 }
    );
  }

  console.log(sessionUser);

  const activity = await createActivity({
    userId: sessionUser.id,
    title: title.toString(),
    targetRecurrence: targetRecurrence.toString(),
  });

  return Response.json(activity);
};
