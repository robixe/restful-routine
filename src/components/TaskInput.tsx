
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim());
      setTaskTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div 
        className={cn(
          "flex items-center gap-2 p-2 rounded-xl border bg-white/70",
          "transition-all duration-300 backdrop-blur-sm",
          isFocused ? "shadow-md border-primary/30 bg-white" : "shadow-sm"
        )}
      >
        <button
          type="submit"
          disabled={!taskTitle.trim()}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            "transition-all duration-300 focus:outline-none",
            taskTitle.trim() 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "bg-muted text-muted-foreground"
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add a new task..."
          className={cn(
            "flex-1 bg-transparent p-2 focus:outline-none text-foreground",
            "placeholder:text-muted-foreground/70"
          )}
          autoComplete="off"
        />
      </div>
    </form>
  );
};

export default TaskInput;
