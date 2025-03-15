
import { Task } from "@/types/Task";

const STORAGE_KEY = 'planning-tasks';

export const loadTasks = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};
