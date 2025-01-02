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
} from "date-fns";

type CalendarProps = {
  commits: Array<{ datetime: string }>;
  targetRecurrence: string;
};

export function ActivityCalendar({ commits, targetRecurrence }: CalendarProps) {
  const data = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 11, 31));

    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

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
        date: day.toISOString().split("T")[0],
        count: 0,
        level: level,
      } as Activity;
    });
  }, [commits, targetRecurrence]);

  console.log("data", data);

  return <ReactActivityCalendar data={data} />;
}
