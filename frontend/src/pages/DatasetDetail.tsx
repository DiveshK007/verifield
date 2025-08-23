import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Download,
  Star,
  Share,
  Flag,
  Shield,
  Calendar,
  Hash,
  Globe,
  Coins,
  Eye,
  Heart,
  Copy,
  ExternalLink
} from 'lucide-react';

// Mock dataset data
const getDataset = (id: string) => ({
  id,
  tokenId: Math.floor(Math.random() * 1000),
  title: 'E-commerce Customer Behavior Dataset',
  description: 'Comprehensive dataset containing customer purchase patterns, browsing history, and demographic information from a major e-commerce platform. This dataset includes over 100,000 customer records with anonymized personal information, transaction history, and behavioral analytics.',
  author: {
    name: 'Dr. Sarah Chen',
    address: '0x742d35Cc4Df8d3F7',
    avatar: 'SC',
    verified: true,
    followers: 1284
  },
  cid: 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
  sha256: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  tags: ['E-commerce', 'Customer Analytics', 'Behavioral Data', 'Machine Learning'],
  price: 299,
  downloads: 1245,
  stars: 89,
  views: 5420,
  size: '2.3 GB',
  lastUpdated: '2 days ago',
  createdAt: '2024-01-15',
  verified: true,
  isPrivate: false
});

const DatasetDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isStarred, setIsStarred] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const dataset = getDataset(id || '1');

  const handlePurchase = async () => {
    setIsPurchasing(true);
    
    // Mock purchase process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Purchase Successful!",
      description: `You can now download "${dataset.title}"`,
    });
    
    setIsPurchasing(false);
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    toast({
      title: isStarred ? "Removed from favorites" : "Added to favorites",
      description: `Dataset ${isStarred ? 'removed from' : 'added to'} your favorites`,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="bg-surface border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-foreground">{dataset.title}</h1>
                    {dataset.verified && (
                      <Badge variant="default" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">{dataset.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {dataset.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {dataset.downloads.toLocaleString()} downloads
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {dataset.stars} stars
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Updated {dataset.lastUpdated}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStar}
                    className={isStarred ? "text-yellow-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {dataset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card className="bg-surface border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {dataset.author.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{dataset.author.name}</h3>
                      {dataset.author.verified && (
                        <Badge variant="default" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{dataset.author.followers.toLocaleString()} followers</p>
                  </div>
                </div>
                <Button variant="outline">
                  Follow
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Token ID</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-foreground">#{dataset.tokenId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(dataset.tokenId.toString(), 'Token ID')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">File Size</Label>
                  <p className="text-foreground">{dataset.size}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">IPFS CID</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-foreground truncate">
                      {dataset.cid}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(dataset.cid, 'IPFS CID')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="text-foreground">{dataset.createdAt}</p>
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">SHA-256 Hash</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-foreground truncate">
                      {dataset.sha256}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(dataset.sha256, 'SHA-256 Hash')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">License</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{dataset.licenseUrl}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(dataset.licenseUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card className="bg-surface border-border/50">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {dataset.price === 0 ? 'FREE' : `${dataset.price} Credits`}
                </div>
                {dataset.price > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ≈ ${(dataset.price * 0.001).toFixed(2)} USD
                  </p>
                )}
              </div>
              
              <Button
                className="w-full mb-3 shadow-glow hover:shadow-elevated transition-all duration-300"
                onClick={handlePurchase}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <>
                    <Coins className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : dataset.price === 0 ? (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Free
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4 mr-2" />
                    Purchase Access
                  </>
                )}
              </Button>
              
              {dataset.price > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Credits will be sent to dataset creator
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Downloads</span>
                <span className="font-medium text-foreground">{dataset.downloads.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stars</span>
                <span className="font-medium text-foreground">{dataset.stars}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Views</span>
                <span className="font-medium text-foreground">{dataset.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium text-foreground">{dataset.size}</span>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">External Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Globe className="h-4 w-4" />
                View on IPFS
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Label = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

export default DatasetDetail;