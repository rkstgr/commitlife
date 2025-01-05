// app/components/ActivityCard.tsx
import { useFetcher } from "@remix-run/react";
import { ActivityCalendar } from "./ActivityCalendar";
import { Activity } from "~/lib/types";
import { Check } from "lucide-react";
import { isToday, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import Button from "./Button";

type ActivityProps = {
  activity: Activity;
};

function isWeekCompleted(
  commits: Activity["commits"],
  targetRecurrence: string
) {
  if (targetRecurrence === "EVERY_DAY") return false;

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const commitsInWeek = commits.filter((commit) =>
    isWithinInterval(new Date(commit.datetime), {
      start: weekStart,
      end: weekEnd,
    })
  );

  return targetRecurrence === "ONCE_A_WEEK"
    ? commitsInWeek.length >= 1
    : commitsInWeek.length >= 2;
}

export function ActivityCard({ activity }: ActivityProps) {
  const fetcher = useFetcher();
  const isCompletedToday = activity.commits.some((commit) =>
    isToday(new Date(commit.datetime))
  );
  const isWeekDone = isWeekCompleted(
    activity.commits,
    activity.targetRecurrence
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
        ) : isWeekDone ? (
          <Button
            className="bg-blue-500/10 text-blue-500 rounded inline-flex items-center gap-2 hover:bg-blue-700/10"
            onClick={handleCommit}
          >
            <Check className="w-6 h-6" />
            <span className="hidden md:inline">This week</span>
          </Button>
        ) : (
          <Button className="md:w-auto" onClick={handleCommit}>
            <span className="hidden md:inline">Complete Today</span>
            <span className="md:hidden">Done</span>
          </Button>
        )}
      </div>
      <ActivityCalendar
        commits={activity.commits}
        targetRecurrence={activity.targetRecurrence}
        activityId={activity.id}
      />
    </div>
  );
}
