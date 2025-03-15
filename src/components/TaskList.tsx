
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/Task';
import { loadTasks, saveTasks } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import TaskItem from './TaskItem';
import TaskInput from './TaskInput';
import TaskStats from './TaskStats';
import EmptyState from './EmptyState';
import { cn } from '@/lib/utils';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
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
    </div>
  );
};

export default TaskList;
