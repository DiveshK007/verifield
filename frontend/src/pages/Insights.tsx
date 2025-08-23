import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AISuggestionBox from '@/components/AISuggestionBox';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  BarChart3,
  ArrowUpRight,
  Brain
} from 'lucide-react';

const insights = [
  {
    id: '1',
    title: 'Upload Timing Optimization',
    description: 'Your datasets get 34% more views when uploaded on Tuesday-Thursday between 2-4 PM EST.',
    impact: 'High',
    category: 'timing',
    action: 'Schedule your next upload accordingly'
  },
  {
    id: '2',
    title: 'Pricing Strategy',
    description: 'Similar datasets in your category are priced 15% higher. Consider adjusting your pricing.',
    impact: 'Medium',
    category: 'pricing',
    action: 'Review pricing for 3 datasets'
  },
  {
    id: '3',
    title: 'Trending Keywords',
    description: 'Adding "transformer", "attention mechanism" tags could increase discoverability by 28%.',
    impact: 'Medium',
    category: 'seo',
    action: 'Update dataset tags'
  },
  {
    id: '4',
    title: 'Collaboration Opportunity',
    description: 'Dr. Sarah Chen has datasets complementary to yours. Consider collaboration.',
    impact: 'Low',
    category: 'network',
    action: 'Send collaboration request'
  }
];

const marketTrends = [
  {
    category: 'Computer Vision',
    growth: '+45%',
    direction: 'up',
    description: 'Highest demand this week'
  },
  {
    category: 'Healthcare AI',
    growth: '+23%',
    direction: 'up',
    description: 'Strong consistent growth'
  },
  {
    category: 'Finance',
    growth: '+12%',
    direction: 'up',
    description: 'Steady upward trend'
  },
  {
    category: 'Social Media',
    growth: '-8%',
    direction: 'down',
    description: 'Seasonal decline expected'
  }
];

const Insights = () => {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
          <p className="text-muted-foreground mt-1">
            Data-driven recommendations to optimize your success
          </p>
        </div>
        <Button className="shadow-glow hover:shadow-elevated transition-all duration-300">
          <Brain className="h-4 w-4 mr-2" />
          Generate New Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Insights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Performance Score</p>
                    <p className="text-2xl font-bold text-foreground">8.7/10</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Potential</p>
                    <p className="text-2xl font-bold text-foreground">+34%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Position</p>
                    <p className="text-2xl font-bold text-foreground">Top 15%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary animate-glow" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 rounded-lg bg-surface-elevated border border-border/30 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                        {insight.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <Button variant="outline" size="sm">
                      {insight.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border/30"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">{trend.category}</h4>
                      <p className="text-sm text-muted-foreground">{trend.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={trend.direction === 'up' ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        {trend.direction === 'up' ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3 rotate-90" />
                        )}
                        {trend.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AISuggestionBox />
          
          {/* Quick Stats */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Views this week</span>
                <Badge variant="secondary">+12.5%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Downloads</span>
                <Badge variant="secondary">+8.3%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <Badge variant="default">+23.1%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New followers</span>
                <Badge variant="secondary">+5.7%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Tips */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">Today's Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-foreground font-medium mb-1">💡 Peak Activity Hour</p>
                <p className="text-muted-foreground text-xs">3-4 PM EST sees highest engagement</p>
              </div>
              <div className="text-sm">
                <p className="text-foreground font-medium mb-1">🎯 Keyword Opportunity</p>
                <p className="text-muted-foreground text-xs">"Edge computing" trending +67%</p>
              </div>
              <div className="text-sm">
                <p className="text-foreground font-medium mb-1">📊 Price Optimization</p>
                <p className="text-muted-foreground text-xs">Consider 10-15% price increase</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Insights;