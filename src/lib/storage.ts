
import { Task, WeeklySchedule, ScheduleItem, User } from "@/types/Task";

const TASKS_STORAGE_KEY = 'planning-tasks';
const SCHEDULE_STORAGE_KEY = 'weekly-schedule';
const USER_STORAGE_KEY = 'planning-user';

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

export const updateTaskTags = (taskId: string, tags: string[]): void => {
  try {
    const tasks = loadTasks();
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, tags } : task
    );
    saveTasks(updatedTasks);
  } catch (error) {
    console.error('Failed to update task tags:', error);
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

export const loadUser = (): User => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Failed to load user from localStorage:', error);
  }
  
  // Return default user (not logged in)
  return { username: '', isLoggedIn: false };
};

export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
};

export const verifyLogin = (username: string, password: string): boolean => {
  // Hard-coded credentials check for admin/admin
  return username === 'admin' && password === 'admin';
};

export const updateLunchTime = (newTimeSlot: string): void => {
  try {
    const schedule = loadWeeklySchedule();
    const updatedItems = schedule.items.map(item => {
      if (item.activity === "Lunch & Break") {
        return { ...item, timeSlot: newTimeSlot };
      }
      return item;
    });
    
    saveWeeklySchedule({ items: updatedItems });
  } catch (error) {
    console.error('Failed to update lunch time:', error);
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
        description: "Prioritize S6 courses, assignments, and PFE tasks. Alternate between theory (studying) and practical work (coding, research).",
        completed: false
      },
      {
        id: `${day.toLowerCase()}-lunch`,
        day: day as ScheduleItem["day"],
        timeSlot: "12:00 - 13:00",
        activity: "Lunch & Break",
        description: "Take time to eat and rest.",
        completed: false
      },
      {
        id: `${day.toLowerCase()}-afternoon-1`,
        day: day as ScheduleItem["day"],
        timeSlot: "13:00 - 15:00",
        activity: "Training / Extra Learning",
        description: "If you have sports, do it and leave at 15:00. If no sports, use this time for 1337 projects, training, or reviewing concepts.",
        completed: false
      },
      {
        id: `${day.toLowerCase()}-afternoon-2`,
        day: day as ScheduleItem["day"],
        timeSlot: "15:00 - 17:00",
        activity: "1337 Work & Personal Projects",
        description: "Only if no sports. Work on the Philosophers project, Fract-ol, or other coding tasks. Continue with your platform development.",
        completed: false
      },
      {
        id: `${day.toLowerCase()}-evening`,
        day: day as ScheduleItem["day"],
        timeSlot: "Evening",
        activity: "Rest, Sport & Social Time",
        description: "Rest & Light Study (2 hours max): Revise, read, or do light coding. Sport/Relaxation if not done earlier. Balance with friends, family, or hobbies.",
        completed: false
      }
    ]),
    
    // Saturday
    {
      id: "saturday-morning",
      day: "Saturday",
      timeSlot: "Morning",
      activity: "Deep Work & Catch-Up",
      description: "Review school work & PFE (focus on planning).",
      completed: false
    },
    {
      id: "saturday-afternoon",
      day: "Saturday",
      timeSlot: "Afternoon",
      activity: "Personal projects",
      description: "Focus on coding, platform, training.",
      completed: false
    },
    {
      id: "saturday-evening",
      day: "Saturday",
      timeSlot: "Evening",
      activity: "Relaxation",
      description: "Relaxation, light review if needed.",
      completed: false
    },
    
    // Sunday
    {
      id: "sunday-all-day",
      day: "Sunday",
      timeSlot: "All day",
      activity: "Rest & Recharge",
      description: "Full rest day, or minimal study if necessary. Spend time on hobbies, family, and self-care.",
      completed: false
    }
  ];
  
  // Update lunch time to 2:00 - 3:00 for weekdays
  const updatedItems = defaultItems.map(item => {
    if (item.activity === "Lunch & Break") {
      return { ...item, timeSlot: "14:00 - 15:00" };
    }
    return item;
  });
  
  return { items: updatedItems };
};
