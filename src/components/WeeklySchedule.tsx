
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
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { saveWeeklySchedule } from '@/lib/storage';

interface WeeklyScheduleProps {
  scheduleItems: ScheduleItem[];
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ scheduleItems }) => {
  const [items, setItems] = React.useState<ScheduleItem[]>(scheduleItems);

  // Handle item completion toggle
  const handleToggleComplete = (id: string) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    
    setItems(updatedItems);
    
    // Save updated items to local storage
    saveWeeklySchedule({ items: updatedItems });
    
    // Show toast notification
    const item = updatedItems.find(i => i.id === id);
    toast({
      title: item?.completed ? "Activity marked as complete" : "Activity marked as incomplete",
      description: item?.activity,
    });
  };

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
              {items
                .filter(item => item.day === day)
                .map(item => (
                  <Card 
                    key={item.id} 
                    className={cn(
                      "overflow-hidden border-l-4 transition-colors",
                      item.completed ? "bg-muted/30" : "",
                      day === "Saturday" || day === "Sunday" 
                        ? "border-l-secondary" 
                        : "border-l-primary"
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`check-${item.id}`}
                            checked={item.completed}
                            onCheckedChange={() => handleToggleComplete(item.id)}
                          />
                          <CardTitle className={cn(
                            "text-lg transition-all",
                            item.completed && "line-through text-muted-foreground"
                          )}>
                            {item.activity}
                          </CardTitle>
                          {item.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{item.timeSlot}</span>
                        </div>
                      </div>
                      <CardDescription className={cn(
                        "mt-1",
                        item.completed && "text-muted-foreground/60"
                      )}>
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
