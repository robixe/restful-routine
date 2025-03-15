
import { Task, WeeklySchedule, ScheduleItem } from "@/types/Task";

const TASKS_STORAGE_KEY = 'planning-tasks';
const SCHEDULE_STORAGE_KEY = 'weekly-schedule';

export const loadTasks = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      return JSON.parse(storedTasks);
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  return [];
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

export const loadWeeklySchedule = (): WeeklySchedule => {
  try {
    const storedSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (storedSchedule) {
      return JSON.parse(storedSchedule);
    }
  } catch (error) {
    console.error('Failed to load weekly schedule from localStorage:', error);
  }
  
  // Return default schedule based on the provided program
  return getDefaultWeeklySchedule();
};

export const saveWeeklySchedule = (schedule: WeeklySchedule): void => {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
  } catch (error) {
    console.error('Failed to save weekly schedule to localStorage:', error);
  }
};

const getDefaultWeeklySchedule = (): WeeklySchedule => {
  const defaultItems: ScheduleItem[] = [
    // Weekdays (Monday-Friday)
    ...["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].flatMap(day => [
      {
        id: `${day.toLowerCase()}-morning`,
        day: day as ScheduleItem["day"],
        timeSlot: "08:00 - 12:00",
        activity: "Focused Work on PFE & School Studies",
        description: "Prioritize S6 courses, assignments, and PFE tasks. Alternate between theory (studying) and practical work (coding, research)."
      },
      {
        id: `${day.toLowerCase()}-lunch`,
        day: day as ScheduleItem["day"],
        timeSlot: "12:00 - 13:00",
        activity: "Lunch & Break",
        description: "Take time to eat and rest."
      },
      {
        id: `${day.toLowerCase()}-afternoon-1`,
        day: day as ScheduleItem["day"],
        timeSlot: "13:00 - 15:00",
        activity: "Training / Extra Learning",
        description: "If you have sports, do it and leave at 15:00. If no sports, use this time for 1337 projects, training, or reviewing concepts."
      },
      {
        id: `${day.toLowerCase()}-afternoon-2`,
        day: day as ScheduleItem["day"],
        timeSlot: "15:00 - 17:00",
        activity: "1337 Work & Personal Projects",
        description: "Only if no sports. Work on the Philosophers project, Fract-ol, or other coding tasks. Continue with your platform development."
      },
      {
        id: `${day.toLowerCase()}-evening`,
        day: day as ScheduleItem["day"],
        timeSlot: "Evening",
        activity: "Rest, Sport & Social Time",
        description: "Rest & Light Study (2 hours max): Revise, read, or do light coding. Sport/Relaxation if not done earlier. Balance with friends, family, or hobbies."
      }
    ]),
    
    // Saturday
    {
      id: "saturday-morning",
      day: "Saturday",
      timeSlot: "Morning",
      activity: "Deep Work & Catch-Up",
      description: "Review school work & PFE (focus on planning)."
    },
    {
      id: "saturday-afternoon",
      day: "Saturday",
      timeSlot: "Afternoon",
      activity: "Personal projects",
      description: "Focus on coding, platform, training."
    },
    {
      id: "saturday-evening",
      day: "Saturday",
      timeSlot: "Evening",
      activity: "Relaxation",
      description: "Relaxation, light review if needed."
    },
    
    // Sunday
    {
      id: "sunday-all-day",
      day: "Sunday",
      timeSlot: "All day",
      activity: "Rest & Recharge",
      description: "Full rest day, or minimal study if necessary. Spend time on hobbies, family, and self-care."
    }
  ];
  
  return { items: defaultItems };
};
