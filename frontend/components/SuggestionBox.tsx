'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { readRecentTokenIds, readDataset } from '@/lib/contracts';
import VerificationBadge from './VerificationBadge';

interface Suggestion {
  id: bigint;
  meta: any;
  relevance: number;
  reason: string;
  score: number;
}

interface SuggestionBoxProps {
  currentTags?: string[];
  currentDomain?: string;
  currentOwner?: string;
  title?: string;
  maxSuggestions?: number;
}

export default function SuggestionBox({ 
  currentTags = [], 
  currentDomain = '', 
  currentOwner = '',
  title = "AI Suggestions",
  maxSuggestions = 5 
}: SuggestionBoxProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState(process.env.NEXT_PUBLIC_AI_MODE === 'on');

  // Get recent datasets for suggestions
  const recentDatasetsQ = useQuery({
    queryKey: ['recentDatasetsForSuggestions'],
    queryFn: async () => {
      const ids = await readRecentTokenIds(50);
      const datasets = await Promise.all(
        ids.map(async (id) => {
          try {
            return await readDataset(id);
          } catch {
            return null;
          }
        })
      );
      return datasets.filter(Boolean);
    },
  });

  // Generate suggestions based on current context
  const generateSuggestions = async () => {
    if (!recentDatasetsQ.data) return;
    
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, aiMode ? 1500 : 500));
    
    const scoredSuggestions: Suggestion[] = recentDatasetsQ.data
      .map((dataset: any, index: number) => {
        let score = 0;
        const reasons: string[] = [];

        // Score based on tag overlap
        if (currentTags.length > 0 && dataset.tags) {
          const tagMatches = currentTags.filter(tag => 
            dataset.tags.some((dTag: string) => 
              dTag.toLowerCase().includes(tag.toLowerCase()) || 
              tag.toLowerCase().includes(dTag.toLowerCase())
            )
          );
          score += tagMatches.length * 2;
          if (tagMatches.length > 0) {
            reasons.push(`Matches tags: ${tagMatches.join(', ')}`);
          }
        }

        // Score based on domain
        if (currentDomain && dataset.domain && 
            dataset.domain.toLowerCase() === currentDomain.toLowerCase()) {
          score += 3;
          reasons.push(`Same domain: ${dataset.domain}`);
        }

        // Score based on owner (if user previously bought from this creator)
        if (currentOwner && dataset.owner && 
            dataset.owner.toLowerCase() === currentOwner.toLowerCase()) {
          score += 2;
          reasons.push(`From trusted creator`);
        }

        // Bonus for verified datasets
        if (dataset.verified) {
          score += 1;
          reasons.push(`Verified dataset`);
        }

        // Bonus for recent uploads
        score += Math.max(0, 10 - index) * 0.1;

        return {
          id: BigInt(index + 1),
          meta: dataset,
          relevance: Math.min(score / 10, 1), // Normalize to 0-1
          reason: reasons.length > 0 ? reasons[0] : 'High-quality research data',
          score,
        };
      })
      .filter(s => s.score > 0) // Only show relevant suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions);
    
    setSuggestions(scoredSuggestions);
    setIsLoading(false);
  };

  // Generate AI suggestions if mode is enabled
  const generateAISuggestions = async () => {
    if (!aiMode || !process.env.OPENAI_API_KEY) {
      generateSuggestions();
      return;
    }

    setIsLoading(true);
    
    try {
      // This would call your AI API endpoint
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, you'd call:
      // const response = await fetch('/api/suggest', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tags: currentTags, domain: currentDomain })
      // });
      // const aiSuggestions = await response.json();
      
      generateSuggestions(); // Fallback to basic suggestions
    } catch (error) {
      console.warn('AI suggestions failed, falling back to basic:', error);
      generateSuggestions();
    }
  };

  useEffect(() => {
    if (recentDatasetsQ.data) {
      generateSuggestions();
    }
  }, [recentDatasetsQ.data, currentTags, currentDomain, currentOwner]);

  if (recentDatasetsQ.isPending) {
    return (
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-800 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-emerald-400">
            {aiMode ? '🤖 AI Powered' : '🧠 Smart Matching'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {process.env.OPENAI_API_KEY && (
            <button
              onClick={() => setAiMode(!aiMode)}
              className={`px-2 py-1 rounded text-xs border transition-colors ${
                aiMode 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                  : 'bg-neutral-500/20 border-neutral-500/40 text-neutral-300'
              }`}
            >
              {aiMode ? 'AI Mode' : 'Basic Mode'}
            </button>
          )}
          
          <button
            onClick={generateAISuggestions}
            disabled={isLoading}
            className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id.toString()}
            className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors cursor-pointer"
            onClick={() => window.location.href = `/dataset/${suggestion.id}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Data #{suggestion.id}</span>
                <VerificationBadge verified={suggestion.meta.verified} size="sm" />
              </div>
              <div className="text-xs text-emerald-400">
                {Math.round(suggestion.relevance * 100)}% match
              </div>
            </div>
            
            <div className="text-sm opacity-80 mb-2">
              {suggestion.meta.domain || 'Research'} • {suggestion.meta.tags?.slice(0, 2).join(', ') || 'No tags'}
            </div>
            
            <div className="text-xs text-emerald-300/80">
              💡 {suggestion.reason}
            </div>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && !isLoading && (
        <div className="text-center py-8 text-neutral-400">
          <div className="text-2xl mb-2">🤖</div>
          <div>No relevant suggestions found</div>
          <div className="text-sm opacity-70">Try adjusting your search criteria</div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8 text-neutral-400">
          <div className="text-2xl mb-2 animate-pulse">🤔</div>
          <div>Analyzing datasets...</div>
          <div className="text-sm opacity-70">Finding the best matches for you</div>
        </div>
      )}
    </div>
  );
}
