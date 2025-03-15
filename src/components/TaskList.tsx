
import React, { useState, useEffect, useCallback } from 'react';
import { Task, ScheduleItem } from '@/types/Task';
import { loadTasks, saveTasks, loadWeeklySchedule } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import TaskItem from './TaskItem';
import TaskInput from './TaskInput';
import TaskStats from './TaskStats';
import EmptyState from './EmptyState';
import WeeklySchedule from './WeeklySchedule';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"tasks" | "schedule">("tasks");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Add a new task
  const handleAddTask = useCallback((title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    
    toast({
      title: "Task added",
      description: "Your new task has been added to the list.",
    });
  }, []);

  // Toggle task completion
  const handleToggleTask = useCallback((id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  // Delete a task
  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  }, []);

  // Get today's day name
  const getTodayDayName = (): ScheduleItem["day"] => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = new Date().getDay();
    return days[dayIndex] as ScheduleItem["day"];
  };

  // Add today's schedule items to tasks
  const addTodayScheduleToTasks = useCallback(() => {
    const weeklySchedule = loadWeeklySchedule();
    const today = getTodayDayName();
    const todayItems = weeklySchedule.items.filter(item => item.day === today);
    
    // Create tasks from schedule items
    const scheduleTasks = todayItems.map(item => ({
      id: `schedule-${item.id}-${Date.now()}`,
      title: `${item.timeSlot} - ${item.activity}`,
      completed: item.completed,
      createdAt: new Date().toISOString(),
    }));
    
    // Add tasks if they don't exist yet
    const existingTaskTitles = tasks.map(task => task.title);
    const newTasks = scheduleTasks.filter(task => !existingTaskTitles.includes(task.title));
    
    if (newTasks.length > 0) {
      setTasks(prevTasks => [...newTasks, ...prevTasks]);
      
      toast({
        title: "Today's schedule added",
        description: `${newTasks.length} activities from today's schedule added to your tasks.`,
      });
    } else {
      toast({
        title: "Schedule already added",
        description: "Today's schedule items are already in your tasks list.",
      });
    }
  }, [tasks]);

  // Load weekly schedule
  const weeklySchedule = loadWeeklySchedule();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "tasks" | "schedule")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tasks">Daily Tasks</TabsTrigger>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <TaskInput onAddTask={handleAddTask} />
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 whitespace-nowrap"
              onClick={addTodayScheduleToTasks}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add Today's Schedule
            </Button>
          </div>
          
          {tasks.length > 0 && <TaskStats tasks={tasks} />}
          
          <div
            className={cn(
              "transition-all duration-300",
              tasks.length === 0 ? "animate-fade-in" : ""
            )}
          >
            {tasks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-0">
          <WeeklySchedule scheduleItems={weeklySchedule.items} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
