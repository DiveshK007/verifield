'use client';

import { useQuery } from '@tanstack/react-query';
import { readLastTokenId, readDataset } from '@/lib/contracts';

export default function DatasetStats() {
  const lastIdQ = useQuery({
    queryKey: ['lastId'],
    queryFn: () => readLastTokenId(),
  });

  const statsQ = useQuery({
    queryKey: ['stats', lastIdQ.data?.toString()],
    enabled: Boolean(lastIdQ.data && lastIdQ.data > 0),
    queryFn: async () => {
      const lastId = lastIdQ.data!;
      const promises = [];
      
      // Sample last 20 datasets for stats
      const sampleSize = Math.min(Number(lastId), 20);
      for (let i = 0; i < sampleSize; i++) {
        promises.push(
          readDataset(lastId - BigInt(i)).catch(() => null)
        );
      }
      
      const datasets = (await Promise.all(promises)).filter(Boolean);
      
      const domains = new Set(datasets.map(d => d!.domain));
      const verified = datasets.filter(d => d!.verified).length;
      const totalTags = datasets.reduce((acc, d) => acc + d!.tags.length, 0);
      
      return {
        totalDatasets: Number(lastId),
        uniqueDomains: domains.size,
        verifiedPercentage: Math.round((verified / datasets.length) * 100),
        avgTagsPerDataset: Math.round(totalTags / datasets.length),
        recentDomains: Array.from(domains),
      };
    },
  });

  if (statsQ.isPending) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-neutral-900/40 border border-neutral-800 rounded p-4 animate-pulse">
            <div className="h-4 bg-neutral-800 rounded mb-2"></div>
            <div className="h-6 bg-neutral-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = statsQ.data;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-neutral-900/40 border border-neutral-800 rounded p-4">
        <div className="text-sm opacity-70">Total Datasets</div>
        <div className="text-2xl font-bold text-emerald-400">{stats.totalDatasets}</div>
      </div>
      <div className="bg-neutral-900/40 border border-neutral-800 rounded p-4">
        <div className="text-sm opacity-70">Domains</div>
        <div className="text-2xl font-bold">{stats.uniqueDomains}</div>
      </div>
      <div className="bg-neutral-900/40 border border-neutral-800 rounded p-4">
        <div className="text-sm opacity-70">Verified</div>
        <div className="text-2xl font-bold text-green-400">{stats.verifiedPercentage}%</div>
      </div>
      <div className="bg-neutral-900/40 border border-neutral-800 rounded p-4">
        <div className="text-sm opacity-70">Avg Tags</div>
        <div className="text-2xl font-bold">{stats.avgTagsPerDataset}</div>
      </div>
    </div>
  );
}
