import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Activity as ActivityIcon, 
  Upload,
  Download,
  Star,
  Users,
  TrendingUp,
  Calendar as CalendarIcon,
  Flame
} from 'lucide-react';

const activityData = [
  {
    id: '1',
    type: 'upload',
    title: 'Uploaded new dataset',
    description: 'E-commerce Customer Behavior Dataset',
    timestamp: '2 hours ago',
    icon: Upload,
    color: 'text-green-500'
  },
  {
    id: '2',
    type: 'purchase',
    title: 'Dataset purchased',
    description: 'Financial Market Indicators sold to Hedge Fund Analytics',
    timestamp: '5 hours ago',
    icon: Download,
    color: 'text-primary'
  },
  {
    id: '3',
    type: 'star',
    title: 'Dataset starred',
    description: 'Climate Change Sentiment Analysis received 5 new stars',
    timestamp: '1 day ago',
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    id: '4',
    type: 'follower',
    title: 'New follower',
    description: 'Dr. Sarah Wilson started following you',
    timestamp: '2 days ago',
    icon: Users,
    color: 'text-blue-500'
  }
];

const streakData = {
  current: 12,
  longest: 28,
  totalDays: 89
};

const Activity = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const activeDates = [
    new Date(2024, 0, 15),
    new Date(2024, 0, 16),
    new Date(2024, 0, 17),
    new Date(2024, 0, 18),
    new Date(2024, 0, 19),
    new Date(2024, 0, 20),
    new Date(2024, 0, 21),
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and daily activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Streak Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold text-foreground">{streakData.current} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                    <p className="text-2xl font-bold text-foreground">{streakData.longest} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Days</p>
                    <p className="text-2xl font-bold text-foreground">{streakData.totalDays}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-surface-elevated border border-border/30 hover:border-primary/20 transition-colors"
                    >
                      <div className={`p-2 rounded-full bg-surface-hover ${activity.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Stats */}
        <div className="space-y-6">
          {/* Activity Calendar */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">Activity Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
                modifiers={{
                  active: activeDates
                }}
                modifiersStyles={{
                  active: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))'
                  }
                }}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Active days</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Yellow highlights show days with activity
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Datasets uploaded</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total downloads</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New followers</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Credits earned</span>
                <Badge variant="default">$2,840</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Activity;