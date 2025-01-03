// app/routes/_index.tsx
import { type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getActivities } from "~/lib/activity.server";
import { ActivityCard } from "../components/ActivityCard";
import { NewActivityModal } from "../components/NewActivityModal";
import { Activity } from "~/lib/types";

export const loader: LoaderFunction = async () => {
  const activities = await getActivities();
  // console.log(JSON.stringify(activities, null, 2));
  return Response.json({ activities });
};

export default function Index() {
  const { activities } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto p-4 max-w-screen-md">
      <h1 className="text-3xl font-bold mb-8">CommitLife</h1>
      <div className="space-y-8">
        {activities.map((activity: Activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
      <div className="mt-8">
        <NewActivityModal />
      </div>
    </main>
  );
}
