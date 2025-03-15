
import React from 'react';
import { ScheduleItem } from '@/types/Task';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeeklyScheduleProps {
  scheduleItems: ScheduleItem[];
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ scheduleItems }) => {
  return (
    <div className="my-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Weekly Schedule</h2>
        <p className="text-muted-foreground">Your weekly planning to stay organized and balanced.</p>
      </div>
      
      <Tabs defaultValue="Monday" className="w-full">
        <TabsList className="w-full mb-4 flex flex-wrap h-auto p-1 bg-white/20 backdrop-blur-sm">
          {DAYS_OF_WEEK.map(day => (
            <TabsTrigger 
              key={day} 
              value={day}
              className="flex-1 py-2"
            >
              {day}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {DAYS_OF_WEEK.map(day => (
          <TabsContent key={day} value={day} className="mt-0">
            <div className="space-y-4">
              {scheduleItems
                .filter(item => item.day === day)
                .map(item => (
                  <Card 
                    key={item.id} 
                    className={cn(
                      "overflow-hidden border-l-4",
                      day === "Saturday" || day === "Sunday" 
                        ? "border-l-secondary" 
                        : "border-l-primary"
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{item.activity}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{item.timeSlot}</span>
                        </div>
                      </div>
                      <CardDescription className="mt-1">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default WeeklySchedule;
