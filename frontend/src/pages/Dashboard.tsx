import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import UserStats from '@/components/UserStats';
import DatasetCard from '@/components/DatasetCard';
import AISuggestionBox from '@/components/AISuggestionBox';
import NetworkStatus from '@/components/NetworkStatus';
import { 
  Search, 
  Filter, 
  Plus, 
  SortDesc, 
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';

// Sample data
const datasets = [
  {
    id: '1',
    title: 'E-commerce Customer Behavior Dataset',
    description: 'Comprehensive dataset containing customer purchase patterns, browsing history, and demographic information from a major e-commerce platform.',
    author: { name: 'Sarah Chen' },
    tags: ['E-commerce', 'Customer Analytics', 'Behavioral Data'],
    downloads: 1245,
    stars: 89,
    price: 299,
    lastUpdated: '2 days ago',
    isPrivate: false,
    verified: true,
    size: '2.3 GB'
  },
  {
    id: '2',
    title: 'Climate Change Sentiment Analysis',
    description: 'Social media posts and news articles related to climate change with sentiment labels and engagement metrics.',
    author: { name: 'Dr. Michael Ross' },
    tags: ['NLP', 'Sentiment Analysis', 'Climate'],
    downloads: 892,
    stars: 156,
    price: 0,
    lastUpdated: '5 days ago',
    isPrivate: false,
    verified: true,
    size: '890 MB'
  },
  {
    id: '3',
    title: 'Financial Market Indicators (Private)',
    description: 'Real-time financial market data with technical indicators and trading signals. High-frequency data for algorithmic trading research.',
    author: { name: 'Alex Johnson' },
    tags: ['Finance', 'Trading', 'Time Series'],
    downloads: 3421,
    stars: 234,
    price: 899,
    lastUpdated: '1 day ago',
    isPrivate: true,
    verified: true,
    size: '5.1 GB'
  }
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('uploaded');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your datasets and track your progress
          </p>
        </div>
        <Button className="shadow-glow hover:shadow-elevated transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Upload Dataset
        </Button>
      </div>

      {/* Network Status */}
      <NetworkStatus />

      {/* Stats */}
      <UserStats />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-surface border-border/50 focus:border-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <SortDesc className="h-4 w-4" />
              Sort
            </Button>
          </div>

          {/* Dataset Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-surface">
              <TabsTrigger value="uploaded" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Uploaded
                <Badge variant="secondary" className="text-xs">
                  {datasets.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="purchased" className="gap-2">
                <Star className="h-4 w-4" />
                Purchased
                <Badge variant="secondary" className="text-xs">
                  12
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Calendar className="h-4 w-4" />
                Favorites
                <Badge variant="secondary" className="text-xs">
                  8
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploaded" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 gap-4">
                {datasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} isOwned />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="purchased" className="space-y-4 mt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No purchased datasets yet</p>
                <Button variant="outline" className="mt-4">
                  Browse Marketplace
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4 mt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No favorites yet</p>
                <Button variant="outline" className="mt-4">
                  Discover Datasets
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AISuggestionBox />
          
          {/* Quick Actions */}
          <div className="p-4 rounded-lg bg-surface border border-border/50">
            <h3 className="font-medium text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Upload New Dataset
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Search className="h-4 w-4" />
                Browse Marketplace
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;