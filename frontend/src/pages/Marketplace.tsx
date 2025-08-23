import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DatasetCard from '@/components/DatasetCard';
import AISuggestionBox from '@/components/AISuggestionBox';
import { 
  Search, 
  Filter, 
  SortDesc, 
  TrendingUp,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';

const featuredDatasets = [
  {
    id: '1',
    title: 'Advanced Neural Network Architectures',
    description: 'State-of-the-art neural network architectures with performance benchmarks and training data.',
    author: { name: 'Dr. Emily Watson' },
    tags: ['Deep Learning', 'Neural Networks', 'Benchmarks'],
    downloads: 5432,
    stars: 892,
    price: 599,
    lastUpdated: '1 day ago',
    isPrivate: false,
    verified: true,
    size: '8.2 GB'
  },
  {
    id: '2',
    title: 'Global Climate Data Collection',
    description: 'Comprehensive climate data from weather stations worldwide, spanning 50+ years of observations.',
    author: { name: 'Climate Research Institute' },
    tags: ['Climate', 'Weather', 'Time Series', 'Research'],
    downloads: 3218,
    stars: 456,
    price: 0,
    lastUpdated: '3 days ago',
    isPrivate: false,
    verified: true,
    size: '12.5 GB'
  },
  {
    id: '3',
    title: 'Medical Imaging Dataset - CT Scans',
    description: 'Anonymized CT scan dataset for medical research with radiologist annotations and diagnostic labels.',
    author: { name: 'Medical AI Research Lab' },
    tags: ['Medical', 'Imaging', 'CT Scans', 'Healthcare'],
    downloads: 2845,
    stars: 723,
    price: 1299,
    lastUpdated: '2 days ago',
    isPrivate: false,
    verified: true,
    size: '25.1 GB'
  }
];

const trendingDatasets = [
  {
    id: '4',
    title: 'Social Media Sentiment Analysis',
    description: 'Large-scale social media posts with sentiment labels and engagement metrics.',
    author: { name: 'Social Analytics Corp' },
    tags: ['NLP', 'Sentiment', 'Social Media'],
    downloads: 1876,
    stars: 342,
    price: 299,
    lastUpdated: '5 days ago',
    isPrivate: false,
    verified: true,
    size: '3.7 GB'
  }
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover and purchase high-quality datasets from the community
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search datasets, research papers, and more..."
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-8">
          {/* Featured Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Featured Datasets</h2>
              <Badge variant="default" className="text-xs">Hot</Badge>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {featuredDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </section>

          {/* Trending Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Trending This Week</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {trendingDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </section>

          {/* Recently Added */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Recently Added</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {featuredDatasets.slice(1, 3).map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AISuggestionBox />
          
          {/* Categories */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">Popular Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'Machine Learning',
                'Computer Vision',
                'Natural Language Processing',
                'Healthcare',
                'Finance',
                'Climate Science'
              ].map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  {category}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">🔥 Computer Vision datasets are trending +45% this week</p>
                <p className="mb-2">📈 Healthcare data demand increased by 23%</p>
                <p>💡 Best time to upload: Tuesday-Thursday</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;