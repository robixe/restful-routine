
import React from 'react';
import { Task } from '@/types/Task';
import { cn } from '@/lib/utils';
import { BarChart3, CheckCircle2 } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const percentComplete = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-1 p-4 rounded-xl border bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Tasks</span>
        </div>
        <p className="text-2xl font-semibold">{totalTasks}</p>
      </div>
      
      <div className="flex-1 p-4 rounded-xl border bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Completed</span>
        </div>
        <p className="text-2xl font-semibold">{completedTasks}</p>
      </div>
      
      <div className="flex-1 p-4 rounded-xl border bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="mb-2">
          <span className="text-sm font-medium">Progress</span>
        </div>
        <div className="relative pt-1">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold inline-block uppercase">
              <span className="text-2xl font-semibold">{percentComplete}%</span>
            </div>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-secondary mt-2">
            <div 
              style={{ width: `${percentComplete}%` }}
              className={cn(
                "shadow-none flex flex-col justify-center text-center text-white rounded-full",
                "transition-all duration-500 ease-out",
                "bg-primary"
              )}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
