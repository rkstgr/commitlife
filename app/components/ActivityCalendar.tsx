import { useMemo } from "react";
import {
  Activity as CalendarActivity,
  ActivityCalendar as ReactActivityCalendar,
} from "react-activity-calendar";
import {
  eachDayOfInterval,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  format,
  isFuture,
} from "date-fns";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useFetcher } from "@remix-run/react";

type CalendarProps = {
  activityId: string;
  commits: Array<{ datetime: string }>;
  targetRecurrence: string;
};

export function ActivityCalendar({
  commits,
  targetRecurrence,
  activityId,
}: CalendarProps) {
  const fetcher = useFetcher();

  const data = useMemo(() => {
    const yearStart = startOfYear(new Date());
    const yearEnd = endOfYear(new Date());
    const days = eachDayOfInterval({
      start: yearStart,
      end: yearEnd,
    });

    return days.map((day) => {
      const hasCommit = commits.some(
        (commit) =>
          new Date(commit.datetime).toDateString() === day.toDateString()
      );

      let level = 0;

      if (targetRecurrence === "EVERY_DAY") {
        level = hasCommit ? 2 : 0;
      } else if (["ONCE_A_WEEK", "TWICE_A_WEEK"].includes(targetRecurrence)) {
        const weekStart = startOfWeek(day, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(day, { weekStartsOn: 1 });

        const commitsInWeek = commits.filter((commit) =>
          isWithinInterval(new Date(commit.datetime), {
            start: weekStart,
            end: weekEnd,
          })
        );

        const targetMet =
          targetRecurrence === "ONCE_A_WEEK"
            ? commitsInWeek.length >= 1
            : commitsInWeek.length >= 2;

        level = hasCommit ? 2 : targetMet ? 1 : 0;
      }

      return {
        date: format(day, "yyyy-MM-dd"),
        count: 0,
        level: level,
      } as CalendarActivity;
    });
  }, [commits, targetRecurrence]);

  const handleClick = (activity: CalendarActivity) => {
    const clickedDate = new Date(activity.date);
    if (isFuture(clickedDate)) return;

    const hasCommit = commits.some(
      (commit) =>
        new Date(commit.datetime).toDateString() === clickedDate.toDateString()
    );

    if (hasCommit) {
      // Remove commit logic
      fetcher.submit(
        { date: activity.date, activityId },
        { method: "delete", action: "/api/commits" }
      );
    } else {
      // Add commit logic
      fetcher.submit(
        { date: activity.date, activityId },
        { method: "post", action: "/api/commits" }
      );
    }
  };

  return (
    <Tooltip.Provider>
      <ReactActivityCalendar
        data={data}
        maxLevel={2}
        theme={{ light: ["#FFDAC2", "#FF9D5C", "#F56200"] }}
        weekStart={1}
        eventHandlers={{
          onClick: () => (activity) => handleClick(activity),
        }}
        renderBlock={(block, activity) => (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>{block}</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="rounded px-2 py-1 text-xs font-medium bg-neutral-800 text-white"
                sideOffset={5}
              >
                {format(new Date(activity.date), "MMM dd, yyyy")}
                <Tooltip.Arrow className="fill-neutral-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        )}
      />
    </Tooltip.Provider>
  );
}
