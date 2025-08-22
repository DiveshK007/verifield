"use client";

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { readDataset, readLastTokenId } from '@/lib/contracts';
import DatasetStats from '@/components/DatasetStats';
import SuggestionBox from '@/components/SuggestionBox';
import VerificationBadge from '@/components/VerificationBadge';

export default function Home() {
  const { address } = useAccount();
  
  const lastQ = useQuery({
    queryKey: ['lastId'],
    queryFn: () => readLastTokenId(),
  });

  const ids = useMemo(() => {
    const last = lastQ.data || 0n;
    const max = 12;
    const list: bigint[] = [];
    for (let i = 0; i < max && last - BigInt(i) > 0; i++) list.push(last - BigInt(i));
    return list;
  }, [lastQ.data]);

  const metasQ = useQuery({
    queryKey: ['metas', ids.join(',')],
    enabled: ids.length > 0,
    queryFn: async () => Promise.all(ids.map((id) => readDataset(id).catch(() => null))),
  });

  const items = (metasQ.data || []).map((m, i) => ({ id: ids[i], meta: m }));
  const domains = Array.from(new Set(items.filter(i => i.meta).map(i => i.meta!.domain))).sort();
  const [filter, setFilter] = useState<string>('');
  const filtered = items.filter(i => !i.meta ? false : !filter || i.meta.domain === filter);

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            Decentralized Research Platform
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              VeriField
            </span>
          </h1>
          
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            The GitHub for research datasets. Upload, verify, and monetize your scientific data on BNB Greenfield with built-in AI discovery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/upload" 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
            >
              🚀 Upload Dataset
            </a>
            <a 
              href="/dataset/1" 
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              🔍 Explore Datasets
            </a>
          </div>

          {!address && (
            <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 max-w-md mx-auto">
              <p className="text-blue-300 text-sm">
                💡 Connect your wallet to access all features including AI suggestions, dashboard, and earnings tracking
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <DatasetStats />
        </div>

        {/* AI Suggestions Section */}
        {address && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Discovery</h2>
              <p className="text-neutral-400">Intelligent suggestions based on your interests and research patterns</p>
            </div>
            <SuggestionBox />
          </div>
        )}

        {/* Recent Datasets Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Recent Datasets</h2>
              <p className="text-neutral-400">Latest research data uploaded to the platform</p>
            </div>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === '' 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10'
                }`} 
                onClick={() => setFilter('')}
              >
                All
              </button>
              {domains.map((d) => (
                <button 
                  key={d} 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === d 
                      ? 'bg-emerald-500 text-white shadow-lg' 
                      : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10'
                  }`} 
                  onClick={() => setFilter(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            {(lastQ.isPending || metasQ.isPending) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-4"></div>
                    <div className="h-3 bg-white/5 rounded mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-white/5 rounded-full"></div>
                      <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!lastQ.isPending && ids.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">No datasets yet</h3>
                <p className="text-neutral-400 mb-6">Be the first to upload and share your research data</p>
                <a 
                  href="/upload" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
                >
                  <span>📤</span>
                  Upload First Dataset
                </a>
              </div>
            )}
            
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(({ id, meta }) => (
                  <a 
                    key={id.toString()} 
                    href={`/dataset/${id.toString()}`}
                    className="group rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                          <span className="text-black font-bold text-sm">📊</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            Data #{id.toString()}
                          </h3>
                          <p className="text-sm text-neutral-400">{meta?.domain || 'Research'}</p>
                        </div>
                      </div>
                      <VerificationBadge verified={meta?.verified || false} size="sm" />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(meta?.tags || []).slice(0, 3).map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-neutral-300">
                          {t}
                        </span>
                      ))}
                      {(meta?.tags || []).length > 3 && (
                        <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-neutral-500">
                          +{(meta?.tags || []).length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Click to explore</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16 border-t border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Share Your Research?</h2>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join the decentralized research community. Upload your datasets, earn from downloads, and accelerate scientific discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/upload" 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
            >
              Start Uploading
            </a>
            <a 
              href="/dashboard" 
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
