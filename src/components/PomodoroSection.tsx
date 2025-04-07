
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import PomodoroTimer from './PomodoroTimer';
import { Task } from '@/types/Task';
import { Clock, CheckCircle, ArrowRight, Target, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';

interface PomodoroSectionProps {
  tasks?: Task[];
}

const PomodoroSection: React.FC<PomodoroSectionProps> = ({ tasks = [] }) => {
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const filteredTasks = tasks.filter(task => !task.completed);

  return (
    <div className="w-full bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Pomodoro Timer</h2>
        </div>

        <Sheet>
          <SheetTrigger className="px-4 py-2 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 flex items-center gap-2">
            <Menu className="h-4 w-4" />
            <span>Full View</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
            <div className="p-6">
              <PomodoroTimer currentTask={selectedTask} />
              
              {filteredTasks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Focus on a task:
                  </h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex-1">
          <PomodoroTimer currentTask={selectedTask} />
        </div>

        {filteredTasks.length > 0 && (
          <div className="flex-1">
            <Card className="border border-primary/10 bg-white/80">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-primary">
                  <Target className="h-4 w-4" />
                  Select a task to focus on
                </h3>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
                  {filteredTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={cn(
                        "p-3 rounded-lg border text-sm transition-all text-left",
                        selectedTask?.id === task.id
                          ? "bg-primary/10 border-primary/30"
                          : "bg-white hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className={cn(
                            "h-4 w-4",
                            selectedTask?.id === task.id ? "text-primary" : "text-muted-foreground/30" 
                          )} />
                          <span className="font-medium">{task.title}</span>
                        </div>
                        {selectedTask?.id === task.id && (
                          <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 ml-6 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroSection;
