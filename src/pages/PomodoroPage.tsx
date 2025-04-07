
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Task } from '@/types/Task';
import { loadTasks, loadUser } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowLeft, CheckCircle, Target, Clock } from 'lucide-react';
import LoginForm from '@/components/LoginForm';

const PomodoroPage = () => {
  const tasks = loadTasks();
  const filteredTasks = tasks.filter(task => !task.completed);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const user = loadUser();
  const isLoggedIn = user?.isLoggedIn;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Login to use Pomodoro Timer</h1>
          <LoginForm onLogin={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full mx-auto px-4 sm:px-6 py-10 min-h-screen animate-fade-in">
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tasks
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Pomodoro Timer</h1>
            </div>
          </div>
        </header>
        
        <main className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
            <PomodoroTimer currentTask={selectedTask} />
          </div>
          
          {filteredTasks.length > 0 && (
            <Card className="border border-primary/10 bg-white/80 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  Select a task to focus on
                </h3>
                <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={cn(
                        "p-4 rounded-xl border text-sm transition-all text-left",
                        selectedTask?.id === task.id
                          ? "bg-primary/10 border-primary/30"
                          : "bg-white hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className={cn(
                            "h-5 w-5",
                            selectedTask?.id === task.id ? "text-primary" : "text-muted-foreground/30" 
                          )} />
                          <span className="font-medium text-base">{task.title}</span>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-2 ml-8">
                          {task.description}
                        </p>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <div className="mt-3 ml-8 flex flex-wrap gap-2">
                          {task.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-primary/5 text-primary/80 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default PomodoroPage;
