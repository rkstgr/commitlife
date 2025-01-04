// app/routes/_index.tsx
import { LoaderFunctionArgs, type LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getActivities } from "~/lib/activity.server";
import { ActivityCard } from "../components/ActivityCard";
import { NewActivityModal } from "../components/NewActivityModal";
import { Activity } from "~/lib/types";
import { sessionStorage } from "~/services/session.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");

  if (user) {
    const activities = await getActivities(user.id);
    return Response.json({ activities, user });
  }

  return Response.json({ activities: null, user: null });
};

export default function Index() {
  const { activities, user } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto p-4 max-w-screen-md">
      <div>
        <h1 className="text-3xl font-bold mb-8">Commit Life</h1>

        <div className="absolute top-0 right-0 mt-4 mr-4">
          {user ? (
            <Form action="/logout" method="post">
              <span className="mr-4 text-sm text-gray-600">
                {user.userEmail}
              </span>
              <button
                type="submit"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Logout
              </button>
            </Form>
          ) : (
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {user &&
          activities.map((activity: Activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
      </div>
      <div className="mt-8">
        <NewActivityModal />
      </div>
    </main>
  );
}
