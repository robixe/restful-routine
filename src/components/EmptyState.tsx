
import React from 'react';
import { ClipboardList } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">No tasks yet</h3>
      <p className="text-muted-foreground text-center max-w-sm">
        Add your first task to start planning your day and keeping track of your progress.
      </p>
    </div>
  );
};

export default EmptyState;
