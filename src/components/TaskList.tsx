
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/Task';
import { loadTasks, saveTasks, loadWeeklySchedule } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import TaskItem from './TaskItem';
import TaskInput from './TaskInput';
import TaskStats from './TaskStats';
import EmptyState from './EmptyState';
import WeeklySchedule from './WeeklySchedule';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
          <TaskInput onAddTask={handleAddTask} />
          
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
