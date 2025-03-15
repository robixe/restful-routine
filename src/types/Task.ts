
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  timeSlot: string;
  activity: string;
  description: string;
  completed: boolean;
}

export interface WeeklySchedule {
  items: ScheduleItem[];
}

export interface User {
  username: string;
  isLoggedIn: boolean;
}
