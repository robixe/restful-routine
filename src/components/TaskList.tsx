import React, { useState, useEffect, useCallback } from 'react';
import { Task, ScheduleItem, User } from '@/types/Task';
import { loadTasks, saveTasks, loadWeeklySchedule, loadUser, saveUser } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import TaskItem from './TaskItem';
import TaskInput from './TaskInput';
import TaskStats from './TaskStats';
import EmptyState from './EmptyState';
import WeeklySchedule from './WeeklySchedule';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, Clock } from 'lucide-react';
import LoginForm from './LoginForm';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"tasks" | "schedule">("tasks");
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    setUser(loadUser());
  }, []);

  // Load tasks from localStorage on component mount and only if user is logged in
  useEffect(() => {
    if (user?.isLoggedIn) {
      setTasks(loadTasks());
    }
  }, [user?.isLoggedIn]);

  // Save tasks to localStorage whenever they change and user is logged in
  useEffect(() => {
    if (user?.isLoggedIn) {
      saveTasks(tasks);
    }
  }, [tasks, user?.isLoggedIn]);

  // Handle successful login
  const handleLogin = (username: string) => {
    const newUser = { username, isLoggedIn: true };
    setUser(newUser);
    saveUser(newUser);
    
    toast({
      title: "Login successful",
      description: `Welcome, ${username}!`,
    });
  };

  // Handle logout
  const handleLogout = () => {
    setUser({ username: '', isLoggedIn: false });
    saveUser({ username: '', isLoggedIn: false });
    
    toast({
      title: "Logout successful",
      description: "You have been logged out.",
    });
  };

  // Add a new task
  const handleAddTask = useCallback((title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: '',
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

  // Update task description
  const handleUpdateDescription = useCallback((id: string, description: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, description } : task
      )
    );
    
    toast({
      title: "Description updated",
      description: "The task description has been updated.",
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
    // Always reload from storage to get the latest schedule (including any edits)
    const weeklySchedule = loadWeeklySchedule();
    const today = getTodayDayName();
    const todayItems = weeklySchedule.items.filter(item => item.day === today);
    
    // Create tasks from schedule items
    const scheduleTasks = todayItems.map(item => ({
      id: `schedule-${item.id}-${Date.now()}`,
      title: `${item.timeSlot} - ${item.activity}`,
      description: item.description,
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

  // Force update tasks from schedule (including lunch time changes)
  const refreshTasksFromSchedule = useCallback(() => {
    const weeklySchedule = loadWeeklySchedule();
    const today = getTodayDayName();
    const todayItems = weeklySchedule.items.filter(item => item.day === today);
    
    // Create tasks from schedule items
    const scheduleTasks = todayItems.map(item => ({
      id: `schedule-${item.id}-${Date.now()}`,
      title: `${item.timeSlot} - ${item.activity}`,
      description: item.description,
      completed: item.completed,
      createdAt: new Date().toISOString(),
    }));
    
    // Remove existing schedule tasks and add new ones
    const nonScheduleTasks = tasks.filter(task => !task.id.startsWith('schedule-'));
    setTasks([...scheduleTasks, ...nonScheduleTasks]);
    
    toast({
      title: "Tasks updated",
      description: "Your task list has been updated with the latest schedule.",
    });
  }, [tasks]);

  // Load weekly schedule
  const weeklySchedule = loadWeeklySchedule();

  // If not logged in, show login form
  if (!user?.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Welcome, {user.username}</h2>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "tasks" | "schedule")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tasks">Daily Tasks</TabsTrigger>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <TaskInput onAddTask={handleAddTask} />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap"
                onClick={addTodayScheduleToTasks}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add Today's Schedule
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap"
                onClick={refreshTasksFromSchedule}
              >
                <Clock className="h-4 w-4 mr-2" />
                Refresh Schedule
              </Button>
            </div>
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
                    onUpdateDescription={handleUpdateDescription}
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
