'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { readRecentTokenIds, readDataset } from '@/lib/contracts';
import VerificationBadge from './VerificationBadge';

interface UserStats {
  totalDatasets: number;
  totalCredits: number;
  datasetsSold: number;
  totalDownloads: number;
  activeDays: number;
  lastActive: string;
}

interface UserDataset {
  id: bigint;
  meta: any;
  sales: number;
  downloads: number;
  revenue: number;
}

export default function UserProfile() {
  const { address } = useAccount();
  const [stats, setStats] = useState<UserStats>({
    totalDatasets: 0,
    totalCredits: 0,
    datasetsSold: 0,
    totalDownloads: 0,
    activeDays: 0,
    lastActive: new Date().toLocaleDateString(),
  });

  // Get all datasets to find user's datasets
  const allDatasetsQ = useQuery({
    queryKey: ['allDatasets'],
    queryFn: async () => {
      const ids = await readRecentTokenIds(100); // Get more datasets for comprehensive view
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

  // Filter user's datasets and calculate stats
  useEffect(() => {
    if (!allDatasetsQ.data || !address) return;

    const userDatasets = allDatasetsQ.data.filter(
      (dataset: any) => dataset.owner.toLowerCase() === address.toLowerCase()
    );

    // Mock data for demonstration - in real app, this would come from smart contracts
    const mockStats: UserStats = {
      totalDatasets: userDatasets.length,
      totalCredits: userDatasets.length * 150 + Math.floor(Math.random() * 500), // Mock credits
      datasetsSold: Math.floor(userDatasets.length * 0.3), // Mock sales
      totalDownloads: userDatasets.length * 25 + Math.floor(Math.random() * 100), // Mock downloads
      activeDays: Math.floor(Math.random() * 30) + 1, // Mock active days
      lastActive: new Date().toLocaleDateString(),
    };

    setStats(mockStats);
  }, [allDatasetsQ.data, address]);

  if (!address) {
    return (
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 text-center">
        <div className="text-lg mb-2">🔒</div>
        <div>Connect your wallet to view profile</div>
      </div>
    );
  }

  if (allDatasetsQ.isPending) {
    return (
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-800 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const userDatasets = allDatasetsQ.data?.filter(
    (dataset: any) => dataset.owner.toLowerCase() === address.toLowerCase()
  ) || [];

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-black">
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">User Profile</h2>
          <div className="text-sm text-neutral-400 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-1">Datasets Owned</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.totalDatasets}</div>
        </div>
        
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-1">Total Credits</div>
          <div className="text-2xl font-bold text-blue-400">{stats.totalCredits}</div>
        </div>
        
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-1">Datasets Sold</div>
          <div className="text-2xl font-bold text-purple-400">{stats.datasetsSold}</div>
        </div>
        
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-1">Total Downloads</div>
          <div className="text-2xl font-bold text-orange-400">{stats.totalDownloads}</div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-2">Activity</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Active Days</span>
              <span className="text-emerald-400">{stats.activeDays}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Active</span>
              <span className="text-neutral-300">{stats.lastActive}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-2">Performance</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Avg Downloads/Day</span>
              <span className="text-blue-400">
                {stats.totalDownloads > 0 ? Math.round(stats.totalDownloads / Math.max(stats.activeDays, 1)) : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Success Rate</span>
              <span className="text-emerald-400">
                {stats.totalDatasets > 0 ? Math.round((stats.datasetsSold / stats.totalDatasets) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Datasets */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">Your Datasets</h3>
        {userDatasets.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            <div className="text-2xl mb-2">📊</div>
            <div>No datasets yet</div>
            <div className="text-sm opacity-70">Upload your first dataset to get started</div>
          </div>
        ) : (
          <div className="space-y-3">
            {userDatasets.map((dataset: any, index: number) => (
              <div
                key={index}
                className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/dataset/${index + 1}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Data #{index + 1}</span>
                    <VerificationBadge verified={dataset.verified} size="sm" />
                  </div>
                  <div className="text-xs text-emerald-400">
                    {Math.floor(Math.random() * 100) + 10} downloads
                  </div>
                </div>
                
                <div className="text-sm opacity-80 mb-2">
                  {dataset.domain || 'Research'} • {dataset.tags?.slice(0, 2).join(', ') || 'No tags'}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span>💰 {Math.floor(Math.random() * 50) + 5} credits earned</span>
                  <span>📥 {Math.floor(Math.random() * 20) + 1} recent downloads</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
