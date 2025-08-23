import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, Database, X, Eye, Bookmark, FileText } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'dataset' | 'paper';
  title: string;
  description: string;
  relevance: number;
  tags: string[];
}

const AISuggestionBox = () => {
  const [suggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'dataset',
      title: 'Neural Network Architecture Performance Dataset',
      description: 'Comprehensive dataset containing performance metrics of various neural network architectures on image classification tasks.',
      relevance: 95,
      tags: ['ML', 'Computer Vision', 'Neural Networks']
    },
    {
      id: '2',
      type: 'paper',
      title: 'Attention Mechanisms in Deep Learning: A Survey',
      description: 'Latest survey paper covering breakthrough attention mechanisms and their applications in transformer models.',
      relevance: 88,
      tags: ['Attention', 'Transformers', 'Survey']
    }
  ]);

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.id));

  if (visibleSuggestions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-surface border-border shadow-soft animate-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary animate-glow" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="relative p-3 rounded-lg bg-surface-elevated border border-border/50 hover:border-primary/30 transition-all duration-300 group"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(suggestion.id)}
              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </Button>

            <div className="flex items-start gap-2 mb-2">
              {suggestion.type === 'dataset' ? (
                <Database className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              ) : (
                <BookOpen className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {suggestion.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 flex-wrap">
                {suggestion.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
                    {tag}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-primary/30">
                  {suggestion.relevance}% match
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Bookmark className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface AISuggestionBoxProps {
  onApplySuggestions?: (suggestions: any) => void;
}

const AISuggestionBoxEnhanced = ({ onApplySuggestions }: AISuggestionBoxProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'dataset',
      title: 'Optimize Your Tags',
      description: 'Based on your content, consider adding: "Machine Learning", "Customer Segmentation", "Retail Analytics"',
      relevance: 95,
      tags: ['optimization', 'tags']
    },
    {
      id: '2', 
      type: 'paper',
      title: 'Improve Description',
      description: 'Your description could be more comprehensive. Consider adding methodology and use cases.',
      relevance: 88,
      tags: ['description', 'improvement']
    }
  ]);
  
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleApply = (suggestion: Suggestion) => {
    if (onApplySuggestions) {
      const mockSuggestions = {
        tags: ['Machine Learning', 'Customer Segmentation', 'Retail Analytics'],
        description: 'Enhanced description with methodology and use cases included.'
      };
      onApplySuggestions(mockSuggestions);
    }
    handleDismiss(suggestion.id);
  };

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.id));

  if (visibleSuggestions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-surface border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-3 rounded-lg bg-surface-elevated border border-border/30"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-primary/10">
                {suggestion.type === 'dataset' ? (
                  <Database className="h-4 w-4 text-primary" />
                ) : (
                  <FileText className="h-4 w-4 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground text-sm">{suggestion.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.relevance}%
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                  {suggestion.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {suggestion.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleApply(suggestion)}
                      className="h-6 text-xs px-2"
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(suggestion.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AISuggestionBoxEnhanced;