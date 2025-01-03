// app/components/ActivityCard.tsx
import { useFetcher } from "@remix-run/react";
import { ActivityCalendar } from "./ActivityCalendar";
import { Activity } from "~/lib/types";
import { Check } from "lucide-react";
import { isToday } from "date-fns";

type ActivityProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityProps) {
  const fetcher = useFetcher();
  const isCompletedToday = activity.commits.some((commit) =>
    isToday(new Date(commit.datetime))
  );

  const handleCommit = () => {
    if (isCompletedToday) return;
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
    <div className="border rounded-lg p-4 shadow-sm dark:border-neutral-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            {activity.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {formatRecurrence(activity.targetRecurrence)}
          </p>
        </div>
        {isCompletedToday ? (
          <div className="bg-green-500/10 text-green-500 p-2 rounded">
            <Check className="w-6 h-6" />
          </div>
        ) : (
          <button
            onClick={handleCommit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Complete Today
          </button>
        )}
      </div>
      <ActivityCalendar
        commits={activity.commits}
        targetRecurrence={activity.targetRecurrence}
      />
    </div>
  );
}
