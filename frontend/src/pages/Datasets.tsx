import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DatasetCard from '@/components/DatasetCard';
import { 
  Search, 
  Filter, 
  Plus, 
  SortDesc, 
  Database,
  Globe,
  Lock
} from 'lucide-react';

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

const Datasets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Datasets</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your dataset collection
          </p>
        </div>
        <Button className="shadow-glow hover:shadow-elevated transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Upload Dataset
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your datasets..."
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-surface">
          <TabsTrigger value="all" className="gap-2">
            <Database className="h-4 w-4" />
            All Datasets
            <Badge variant="secondary" className="text-xs">
              {datasets.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="public" className="gap-2">
            <Globe className="h-4 w-4" />
            Public
            <Badge variant="secondary" className="text-xs">
              {datasets.filter(d => !d.isPrivate).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="private" className="gap-2">
            <Lock className="h-4 w-4" />
            Private
            <Badge variant="secondary" className="text-xs">
              {datasets.filter(d => d.isPrivate).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} isOwned />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="public" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {datasets.filter(d => !d.isPrivate).map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} isOwned />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="private" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {datasets.filter(d => d.isPrivate).map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} isOwned />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Datasets;