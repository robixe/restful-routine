
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import PomodoroTimer from './PomodoroTimer';
import { Task } from '@/types/Task';
import { Clock, CheckCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface PomodoroSectionProps {
  tasks?: Task[];
}

const PomodoroSection: React.FC<PomodoroSectionProps> = ({ tasks = [] }) => {
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const filteredTasks = tasks.filter(task => !task.completed);

  return (
    <div className="bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Pomodoro Timer</h2>
        </div>

        <Sheet>
          <SheetTrigger className="px-4 py-2 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20">
            Full View
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
            <div className="p-6">
              <PomodoroTimer currentTask={selectedTask} />
              
              {filteredTasks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-2">Focus on a task:</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {filteredTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border text-sm transition-all",
                          selectedTask?.id === task.id
                            ? "bg-primary/10 border-primary/30"
                            : "bg-white hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <CheckCircle className={cn(
                              "h-4 w-4",
                              selectedTask?.id === task.id ? "text-primary" : "text-muted-foreground/30" 
                            )} />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <PomodoroTimer currentTask={selectedTask} />

      {filteredTasks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Select a task to focus on:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-2">
            {filteredTasks.slice(0, 4).map(task => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={cn(
                  "p-2 rounded-lg border text-sm transition-all",
                  selectedTask?.id === task.id
                    ? "bg-primary/10 border-primary/30"
                    : "bg-white hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className={cn(
                    "h-4 w-4",
                    selectedTask?.id === task.id ? "text-primary" : "text-muted-foreground/30" 
                  )} />
                  <span className="truncate">{task.title}</span>
                </div>
              </button>
            ))}
            {filteredTasks.length > 4 && (
              <Sheet>
                <SheetTrigger className="p-2 rounded-lg border text-sm transition-all bg-gray-50 hover:bg-gray-100">
                  +{filteredTasks.length - 4} more tasks
                </SheetTrigger>
                <SheetContent side="bottom">
                  <h3 className="text-lg font-medium mb-4">Select a task to focus on</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task);
                          document.querySelector('[data-state="open"]')?.dispatchEvent(
                            new KeyboardEvent('keydown', { key: 'Escape' })
                          );
                        }}
                        className={cn(
                          "p-3 rounded-lg border text-sm transition-all text-left",
                          selectedTask?.id === task.id
                            ? "bg-primary/10 border-primary/30"
                            : "bg-white hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-start">
                          <CheckCircle className={cn(
                            "h-4 w-4 mt-0.5",
                            selectedTask?.id === task.id ? "text-primary" : "text-muted-foreground/30" 
                          )} />
                          <div className="ml-2">
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroSection;
