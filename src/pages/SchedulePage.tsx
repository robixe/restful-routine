
import React from 'react';
import { Link } from 'react-router-dom';
import WeeklySchedule from '@/components/WeeklySchedule';
import { loadWeeklySchedule, loadUser } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import LoginForm from '@/components/LoginForm';

const SchedulePage = () => {
  const weeklySchedule = loadWeeklySchedule();
  const user = loadUser();
  const isLoggedIn = user?.isLoggedIn;
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Login to view Weekly Schedule</h1>
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
              <Calendar className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Weekly Schedule</h1>
            </div>
          </div>
        </header>
        
        <main className="w-full">
          <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6">
            <WeeklySchedule scheduleItems={weeklySchedule.items} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchedulePage;
