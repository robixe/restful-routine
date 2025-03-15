
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 mb-2 rounded-xl border",
        "bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300",
        "hover:shadow-md hover:bg-white",
        "animate-scale-in"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0 focus:outline-none transition-transform duration-300 hover:scale-110"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle className="h-6 w-6 text-primary transition-all duration-300" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground transition-all duration-300" />
          )}
        </button>
        <span
          className={cn(
            "transition-all duration-300",
            task.completed ? "text-muted-foreground line-through" : "text-foreground"
          )}
        >
          {task.title}
        </span>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className={cn(
          "text-muted-foreground/40 hover:text-destructive transition-all duration-300",
          "opacity-0 group-hover:opacity-100 focus:opacity-100",
          "transform scale-90 group-hover:scale-100",
          "focus:outline-none"
        )}
        aria-label="Delete task"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TaskItem;
