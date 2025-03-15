
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDescription?: (id: string, description: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onUpdateDescription }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(task.description || '');

  const handleDescriptionSubmit = () => {
    if (onUpdateDescription) {
      onUpdateDescription(task.id, description);
    }
    setEditingDescription(false);
  };

  return (
    <div
      className={cn(
        "group flex flex-col p-4 mb-2 rounded-xl border",
        "bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300",
        "hover:shadow-md hover:bg-white",
        "animate-scale-in"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-primary transition-all duration-300 focus:outline-none"
            aria-label={isExpanded ? "Collapse task" : "Expand task"}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
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
      </div>

      {isExpanded && (
        <div className="mt-3 pl-9">
          {editingDescription ? (
            <div className="mt-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 text-sm border rounded-md"
                placeholder="Add a description..."
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditingDescription(false)}
                  className="px-3 py-1 text-xs rounded-md border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDescriptionSubmit}
                  className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => setEditingDescription(true)}
            >
              {task.description ? (
                <p className="whitespace-pre-wrap">{task.description}</p>
              ) : (
                <p className="italic">Click to add a description...</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
