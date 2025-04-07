
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/Task';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TaskTagsProps {
  task: Task;
  onUpdateTags: (id: string, tags: string[]) => void;
}

const PRESET_TAGS = [
  { name: 'Important', color: 'bg-red-100 text-red-800 border-red-200' },
  { name: 'Work', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'Personal', color: 'bg-green-100 text-green-800 border-green-200' },
  { name: 'Study', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { name: 'Health', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
];

const getTagColor = (tagName: string) => {
  const preset = PRESET_TAGS.find(pt => pt.name.toLowerCase() === tagName.toLowerCase());
  if (preset) return preset.color;
  
  // Generate a consistent color based on the tag name
  const hash = tagName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = hash % 360;
  return `bg-[hsl(${hue},85%,95%)] text-[hsl(${hue},70%,35%)] border-[hsl(${hue},70%,90%)]`;
};

const TaskTags: React.FC<TaskTagsProps> = ({ task, onUpdateTags }) => {
  const [newTag, setNewTag] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  
  const tags = task.tags || [];
  
  const handleAddTag = (tagName: string) => {
    const trimmedTag = tagName.trim();
    if (!trimmedTag) return;
    
    if (tags.includes(trimmedTag)) {
      toast({
        title: "Tag already exists",
        description: `The tag "${trimmedTag}" is already added to this task.`,
      });
      return;
    }
    
    const updatedTags = [...tags, trimmedTag];
    onUpdateTags(task.id, updatedTags);
    setNewTag('');
    setShowPresets(false);
  };
  
  const handleRemoveTag = (tagName: string) => {
    const updatedTags = tags.filter(tag => tag !== tagName);
    onUpdateTags(task.id, updatedTags);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag) {
      e.preventDefault();
      handleAddTag(newTag);
    } else if (e.key === 'Escape') {
      setShowPresets(false);
      setNewTag('');
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.length > 0 ? (
          tags.map(tag => (
            <span 
              key={tag} 
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                getTagColor(tag)
              )}
            >
              {tag}
              <button 
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-opacity-60 hover:text-opacity-100 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground italic">No tags added yet</span>
        )}
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onFocus={() => setShowPresets(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="w-full p-1.5 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-primary"
        />
        
        {showPresets && (
          <div className="absolute top-full left-0 z-10 w-full mt-1 p-2 bg-white rounded-md shadow-md border">
            <p className="text-xs text-muted-foreground mb-2">Preset tags or type a custom tag</p>
            <div className="flex flex-wrap gap-1">
              {PRESET_TAGS.map(tag => (
                <button
                  key={tag.name}
                  onClick={() => handleAddTag(tag.name)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md cursor-pointer",
                    tag.color
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTags;
