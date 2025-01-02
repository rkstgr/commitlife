// app/components/ActivityCard.tsx
import { useFetcher } from "@remix-run/react";
import { ActivityCalendar } from "./ActivityCalendar";
import { Activity } from "~/lib/types";

type ActivityProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityProps) {
  const fetcher = useFetcher();

  const handleCommit = () => {
    fetcher.submit(
      { activityId: activity.id },
      { method: "post", action: "/api/commits" }
    );
  };

  const formatRecurrence = (recurrence: string) => {
    const formatted = recurrence.toLowerCase().replace(/_/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{activity.title}</h2>
          <p className="text-gray-600">
            {formatRecurrence(activity.targetRecurrence)}
          </p>
        </div>
        <button
          onClick={handleCommit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Complete Today
        </button>
      </div>
      <ActivityCalendar
        commits={activity.commits}
        targetRecurrence={activity.targetRecurrence}
      />
    </div>
  );
}
