
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  timeSlot: string;
  activity: string;
  description: string;
}

export interface WeeklySchedule {
  items: ScheduleItem[];
}
