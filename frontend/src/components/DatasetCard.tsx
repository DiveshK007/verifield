import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Database, 
  Star, 
  Download, 
  Eye, 
  Calendar,
  Coins,
  GitBranch,
  Lock,
  Globe
} from 'lucide-react';

interface Dataset {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  downloads: number;
  stars: number;
  price: number;
  lastUpdated: string;
  isPrivate: boolean;
  verified: boolean;
  size: string;
}

interface DatasetCardProps {
  dataset: Dataset;
  isOwned?: boolean;
}

const DatasetCard = ({ dataset, isOwned = false }: DatasetCardProps) => {
  const [isStarred, setIsStarred] = useState(false);

  const handleStar = () => {
    setIsStarred(!isStarred);
  };

  return (
    <Card className="bg-surface border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-soft group relative overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors cursor-pointer">
                  {dataset.title}
                </h3>
                {dataset.verified && (
                  <Badge variant="default" className="text-xs px-1.5 py-0.5">
                    Verified
                  </Badge>
                )}
                {dataset.isPrivate ? (
                  <Lock className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Globe className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {dataset.description}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStar}
            className={`h-8 w-8 p-0 ${isStarred ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
          >
            <Star className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs bg-surface-elevated">
                {dataset.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>{dataset.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{dataset.lastUpdated}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {dataset.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
              {tag}
            </Badge>
          ))}
          {dataset.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{dataset.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{dataset.downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{dataset.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              <span>{dataset.size}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {dataset.price > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                <Coins className="h-3 w-3" />
                <span>{dataset.price}</span>
              </div>
            )}
            <Button size="sm" variant={isOwned ? "secondary" : "default"}>
              {isOwned ? (
                <Eye className="h-4 w-4" />
              ) : dataset.price > 0 ? (
                'Purchase'
              ) : (
                'Download'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetCard;