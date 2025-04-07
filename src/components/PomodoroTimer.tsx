
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Task, PomodoroSettings } from '@/types/Task';
import { Play, Pause, Settings, Music } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  currentTask?: Task;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusTime: 25,
  breakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  playSound: true,
};

type TimerMode = 'focus' | 'break' | 'longBreak';

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ currentTask }) => {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const savedSettings = localStorage.getItem('pomodoro-settings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_291bcd671a.mp3?filename=lofi-study-112191.mp3');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);
  
  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current as number);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);
  
  // Music control based on timer mode
  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying && mode === 'focus') {
        audioRef.current.play().catch(error => {
          console.error("Audio play failed:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying, mode]);
  
  const handleTimerComplete = () => {
    if (mode === 'focus') {
      const newPomodorosCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newPomodorosCompleted);
      
      const isLongBreakDue = newPomodorosCompleted % settings.longBreakInterval === 0;
      const nextMode: TimerMode = isLongBreakDue ? 'longBreak' : 'break';
      const nextDuration = isLongBreakDue ? settings.longBreakTime : settings.breakTime;
      
      setMode(nextMode);
      setTimeLeft(nextDuration * 60);
      
      toast({
        title: "Focus session completed!",
        description: isLongBreakDue
          ? `Time for a longer break (${settings.longBreakTime} minutes)`
          : `Time for a short break (${settings.breakTime} minutes)`,
      });
      
      if (settings.autoStartBreaks) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } else {
      // Break or long break completed
      setMode('focus');
      setTimeLeft(settings.focusTime * 60);
      
      toast({
        title: "Break completed!",
        description: `Ready for another ${settings.focusTime} minute focus session.`,
      });
      
      if (settings.autoStartPomodoros) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }
  };
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus') {
      setTimeLeft(settings.focusTime * 60);
    } else if (mode === 'break') {
      setTimeLeft(settings.breakTime * 60);
    } else {
      setTimeLeft(settings.longBreakTime * 60);
    }
  };
  
  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={cn(
      "p-6 rounded-xl shadow-md bg-white/80 backdrop-blur-sm border transition-all",
      mode === 'focus' ? "border-primary" : "border-secondary"
    )}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {mode === 'focus' ? 'Focus Time' : mode === 'break' ? 'Short Break' : 'Long Break'}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? "Mute music" : "Play music"}
            className={cn(
              isMusicPlaying && mode === 'focus' ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Music className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Timer Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="focusTime">Focus Time: {settings.focusTime} min</Label>
                  <Slider 
                    id="focusTime"
                    min={5}
                    max={60}
                    step={5}
                    value={[settings.focusTime]}
                    onValueChange={(value) => setSettings({...settings, focusTime: value[0]})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="breakTime">Short Break: {settings.breakTime} min</Label>
                  <Slider 
                    id="breakTime"
                    min={1}
                    max={15}
                    step={1}
                    value={[settings.breakTime]}
                    onValueChange={(value) => setSettings({...settings, breakTime: value[0]})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longBreakTime">Long Break: {settings.longBreakTime} min</Label>
                  <Slider 
                    id="longBreakTime"
                    min={5}
                    max={30}
                    step={5}
                    value={[settings.longBreakTime]}
                    onValueChange={(value) => setSettings({...settings, longBreakTime: value[0]})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longBreakInterval">Sessions before long break: {settings.longBreakInterval}</Label>
                  <Slider 
                    id="longBreakInterval"
                    min={2}
                    max={6}
                    step={1}
                    value={[settings.longBreakInterval]}
                    onValueChange={(value) => setSettings({...settings, longBreakInterval: value[0]})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoStartBreaks">Auto-start breaks</Label>
                  <Switch 
                    id="autoStartBreaks"
                    checked={settings.autoStartBreaks}
                    onCheckedChange={(checked) => setSettings({...settings, autoStartBreaks: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoStartPomodoros">Auto-start focus sessions</Label>
                  <Switch 
                    id="autoStartPomodoros"
                    checked={settings.autoStartPomodoros}
                    onCheckedChange={(checked) => setSettings({...settings, autoStartPomodoros: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="playSound">Play sound</Label>
                  <Switch 
                    id="playSound"
                    checked={settings.playSound}
                    onCheckedChange={(checked) => setSettings({...settings, playSound: checked})}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex flex-col items-center my-6">
        <div className={cn(
          "text-5xl font-mono font-bold",
          mode === 'focus' ? "text-primary" : "text-secondary"
        )}>
          {formatTime(timeLeft)}
        </div>
        
        {currentTask && (
          <div className="mt-2 text-center text-muted-foreground">
            <span>Current task: </span>
            <span className="font-medium text-foreground">{currentTask.title}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-2">
        <Button 
          onClick={toggleTimer}
          className={cn(
            "px-6",
            mode === 'focus' ? "bg-primary/90 hover:bg-primary" : "bg-secondary/90 hover:bg-secondary"
          )}
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={resetTimer}>
          Reset
        </Button>
      </div>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>Session {pomodorosCompleted + 1} • {Math.floor(pomodorosCompleted / settings.longBreakInterval)} sets completed</p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
