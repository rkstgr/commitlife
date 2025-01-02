export interface Activity {
  id: string;
  title: string;
  targetRecurrence: string;
  commits: Array<{
    datetime: string;
  }>;
}
