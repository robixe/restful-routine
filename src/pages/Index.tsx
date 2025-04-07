
import React from 'react';
import TaskList from '@/components/TaskList';
import PomodoroSection from '@/components/PomodoroSection';
import { cn } from '@/lib/utils';
import { loadTasks, loadUser } from '@/lib/storage';

const Index = () => {
  // Get all tasks and the user state
  const tasks = loadTasks();
  const user = loadUser();
  const isLoggedIn = user?.isLoggedIn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div 
        className={cn(
          "max-w-4xl mx-auto px-6 py-10 min-h-screen",
          "animate-fade-in"
        )}
      >
        <header className="mb-10 text-center">
          <div className="inline-block mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-primary/10 text-primary rounded-full mb-2">
              Planning
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Your Daily Tasks</h1>
          <p className="text-lg text-muted-foreground">
            Plan your day, track your progress, and stay organized.
          </p>
        </header>
        
        <main>
          {isLoggedIn && <PomodoroSection tasks={tasks} />}
          
          <div className="bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
            <TaskList />
          </div>
        </main>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>All your tasks are saved locally in your browser.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
