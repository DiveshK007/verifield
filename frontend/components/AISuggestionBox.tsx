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
}

export default function AISuggestionBox() {
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get recent datasets for suggestions
  const recentDatasetsQ = useQuery({
    queryKey: ['recentDatasets'],
    queryFn: async () => {
      const ids = await readRecentTokenIds(20);
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

  // Generate AI suggestions based on user interests and available datasets
  const generateSuggestions = async () => {
    if (!recentDatasetsQ.data) return;
    
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockSuggestions: Suggestion[] = recentDatasetsQ.data
      .map((dataset: any, index: number) => ({
        id: BigInt(index + 1),
        meta: dataset,
        relevance: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
        reason: generateReason(dataset, userInterests),
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
    
    setSuggestions(mockSuggestions);
    setIsLoading(false);
  };

  const generateReason = (dataset: any, interests: string[]): string => {
    const reasons = [
      `Based on your interest in ${dataset.domain || 'research'}`,
      `Popular in ${dataset.domain || 'this field'}`,
      `Recently verified dataset`,
      `High-quality research data`,
      `Matches your research interests`,
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  useEffect(() => {
    // Mock user interests - in real app, this would come from user profile
    setUserInterests(['climate', 'health', 'AI', 'blockchain']);
    generateSuggestions();
  }, [recentDatasetsQ.data]);

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
        <h3 className="text-lg font-semibold flex items-center gap-2">
          🤖 AI Suggestions
          <span className="text-sm text-emerald-400">Powered by AI</span>
        </h3>
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
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
          <div>No suggestions yet</div>
          <div className="text-sm opacity-70">Try refreshing or check back later</div>
        </div>
      )}
    </div>
  );
}
