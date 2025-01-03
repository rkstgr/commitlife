import { useMemo } from "react";
import {
  Activity,
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
} from "date-fns";
import * as Tooltip from "@radix-ui/react-tooltip";

type CalendarProps = {
  commits: Array<{ datetime: string }>;
  targetRecurrence: string;
};

export function ActivityCalendar({ commits, targetRecurrence }: CalendarProps) {
  const data = useMemo(() => {
    const yearStart = startOfYear(new Date());
    const yearEnd = endOfYear(new Date());
    console.log(yearStart, yearEnd);
    const days = eachDayOfInterval({
      start: new Date(2025, 0, 1),
      end: new Date(2025, 0, 10),
    });

    return days.map((day) => {
      const hasCommit = commits.some(
        (commit) =>
          new Date(commit.datetime).toDateString() === day.toDateString()
      );

      let level = 0;

      if (targetRecurrence === "EVERY_DAY") {
        level = hasCommit ? 4 : 0;
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

        level = hasCommit ? 4 : targetMet ? 1 : 0;
      }

      return {
        date: format(day, "yyyy-MM-dd"),
        count: 0,
        level: level,
      } as Activity;
    });
  }, [commits, targetRecurrence]);

  return (
    <Tooltip.Provider>
      <ReactActivityCalendar
        data={data}
        weekStart={1}
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
