import { LoaderFunctionArgs, type LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getActivities } from "~/lib/activity.server";
import { ActivityCard } from "../components/ActivityCard";
import { NewActivityModal } from "../components/NewActivityModal";
import { Activity } from "~/lib/types";
import { sessionStorage } from "~/services/session.server";
import FeedbackButton from "~/components/FeedbackButton";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");

  if (user) {
    const activities = await getActivities(user.id);
    return { activities, user };
  }

  return { activities: null, user: null };
};

export default function Index() {
  const { activities, user } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto p-4 max-w-screen-md">
      <header className="flex flex-col gap-2 py-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Commit Life</h1>
          <FeedbackButton />
        </div>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {user.email}
              </span>
              <Form action="/logout" method="post">
                <button type="submit" className="text-blue-600">
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          )}
        </div>
      </header>

      {user && (
        <>
          <div className="space-y-8">
            {activities.map((activity: Activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
          <div className="mt-8 mx-auto text-center">
            <NewActivityModal />
          </div>
        </>
      )}
    </main>
  );
}
