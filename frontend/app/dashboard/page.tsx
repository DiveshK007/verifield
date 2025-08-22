'use client';

import { useState, useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { readRecentTokenIds, readDataset } from '@/lib/contracts';
import { marketplaceAbi } from '@/lib/abis/Marketplace';
import StatsCard from '@/components/StatsCard';
import VerificationBadge from '@/components/VerificationBadge';
import { formatEther } from 'viem';

interface ActivityItem {
  id: string;
  type: 'upload' | 'purchase' | 'sale' | 'withdraw';
  title: string;
  description: string;
  timestamp: Date;
  amount?: bigint;
  tokenId?: bigint;
}

export default function Dashboard() {
  const { address } = useAccount();
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d');

  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

  // Get user summary from marketplace
  const { data: userSummary } = useReadContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'getUserSummary',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  // Get owned tokens
  const { data: ownedTokens } = useReadContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'getOwnedTokens',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  // Get recent datasets for activity feed
  const recentDatasetsQ = useQuery({
    queryKey: ['recentDatasets', address],
    queryFn: async () => {
      if (!address) return [];
      const ids = await readRecentTokenIds(20);
      const datasets = await Promise.all(
        ids.map(async (id) => {
          try {
            const dataset = await readDataset(id);
            return { id, ...dataset };
          } catch {
            return null;
          }
        })
      );
      return datasets.filter(Boolean);
    },
    enabled: !!address,
  });

  // Generate mock activity data
  const activityData = useMemo((): ActivityItem[] => {
    if (!address || !recentDatasetsQ.data) return [];
    
    const activities: ActivityItem[] = [];
    
    // Add recent uploads by user
    recentDatasetsQ.data
      .filter(dataset => dataset?.owner?.toLowerCase() === address.toLowerCase())
      .slice(0, 5)
      .forEach((dataset, i) => {
        activities.push({
          id: `upload-${dataset.id}`,
          type: 'upload',
          title: `Uploaded Dataset #${dataset.id}`,
          description: `${dataset.domain || 'Research'} dataset`,
          timestamp: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000),
          tokenId: dataset.id,
        });
      });

    // Add mock purchases
    if (ownedTokens && ownedTokens.length > 0) {
      ownedTokens.slice(0, 3).forEach((tokenId, i) => {
        activities.push({
          id: `purchase-${tokenId}`,
          type: 'purchase',
          title: `Purchased Dataset #${tokenId}`,
          description: 'Added to your collection',
          timestamp: new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000),
          amount: BigInt('10000000000000000'), // 0.01 ETH
          tokenId,
        });
      });
    }

    // Add mock sales
    if (userSummary && userSummary[1] > 0) {
      for (let i = 0; i < Math.min(Number(userSummary[1]), 3); i++) {
        activities.push({
          id: `sale-${i}`,
          type: 'sale',
          title: `Dataset Sold`,
          description: 'Someone purchased your dataset',
          timestamp: new Date(Date.now() - (i + 2) * 4 * 24 * 60 * 60 * 1000),
          amount: BigInt('10000000000000000'),
        });
      }
    }

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [address, recentDatasetsQ.data, ownedTokens, userSummary]);

  // Calculate chart data for earnings over time
  const chartData = useMemo(() => {
    const days = timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Mock earnings data
      const earnings = Math.random() * 0.05; // 0-0.05 ETH per day
      
      data.push({
        date: date.toISOString().split('T')[0],
        earnings: earnings,
        uploads: Math.floor(Math.random() * 3),
      });
    }
    
    return data;
  }, [timeFilter]);

  if (!address) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet to View Dashboard</h2>
            <p className="text-neutral-400">Your personal research dashboard awaits</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Research Dashboard</h1>
          <p className="text-xl text-neutral-400">
            Welcome back! Here's your research activity overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Datasets Uploaded"
            value={userSummary ? Number(userSummary[0]) : 0}
            subtitle="Your contributions"
            icon="📊"
            color="emerald"
          />
          <StatsCard
            title="Sales Made"
            value={userSummary ? Number(userSummary[1]) : 0}
            subtitle="Times purchased"
            icon="💰"
            color="blue"
          />
          <StatsCard
            title="Credits Earned"
            value={userSummary ? `${formatEther(userSummary[2])} ETH` : '0 ETH'}
            subtitle="Available to withdraw"
            icon="🏦"
            color="purple"
          />
          <StatsCard
            title="Datasets Owned"
            value={userSummary ? Number(userSummary[3]) : 0}
            subtitle="In your collection"
            icon="📁"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Earnings Chart */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Earnings Over Time</h3>
              <div className="flex gap-2">
                {(['7d', '30d', 'all'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      timeFilter === period
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    {period === 'all' ? 'All Time' : period.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {chartData.slice(-7).map((day, i) => (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="text-xs text-neutral-400 w-12">
                    {new Date(day.date).toLocaleDateString('en', { day: '2-digit', month: 'short' })}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(day.earnings * 2000, 5)}%` }}
                    />
                  </div>
                  <div className="text-xs text-emerald-400 w-16 text-right">
                    {day.earnings.toFixed(3)} ETH
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Activity Summary</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400">📊</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Total Uploads</p>
                    <p className="text-sm text-neutral-400">Research datasets shared</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-emerald-400">
                  {userSummary ? Number(userSummary[0]) : 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400">🛒</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Purchases Made</p>
                    <p className="text-sm text-neutral-400">Datasets acquired</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-400">
                  {ownedTokens ? ownedTokens.length : 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400">💎</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Success Rate</p>
                    <p className="text-sm text-neutral-400">Datasets sold vs uploaded</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-400">
                  {userSummary && userSummary[0] > 0 
                    ? Math.round((Number(userSummary[1]) / Number(userSummary[0])) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          
          {activityData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📈</div>
              <p className="text-neutral-400">No recent activity</p>
              <p className="text-sm text-neutral-500 mt-2">Upload datasets or make purchases to see activity here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activityData.slice(0, 8).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'upload' ? 'bg-emerald-500/20' :
                    activity.type === 'purchase' ? 'bg-blue-500/20' :
                    activity.type === 'sale' ? 'bg-purple-500/20' :
                    'bg-orange-500/20'
                  }`}>
                    <span className="text-lg">
                      {activity.type === 'upload' ? '📤' :
                       activity.type === 'purchase' ? '🛒' :
                       activity.type === 'sale' ? '💰' : '🏦'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{activity.title}</h4>
                    <p className="text-sm text-neutral-400">{activity.description}</p>
                  </div>
                  
                  <div className="text-right">
                    {activity.amount && (
                      <p className="font-semibold text-emerald-400">
                        +{formatEther(activity.amount)} ETH
                      </p>
                    )}
                    <p className="text-xs text-neutral-500">
                      {activity.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  
                  {activity.tokenId && (
                    <a 
                      href={`/dataset/${activity.tokenId}`}
                      className="px-3 py-1 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a 
            href="/upload"
            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 hover:from-emerald-500/30 hover:to-blue-500/30 transition-all duration-300 group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Upload New Dataset</h3>
            <p className="text-neutral-300 text-sm">Share your research with the community</p>
          </a>

          <a 
            href="/"
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">Discover Datasets</h3>
            <p className="text-neutral-300 text-sm">Find and purchase research data</p>
          </a>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Analytics Coming Soon</h3>
            <p className="text-neutral-300 text-sm">Detailed insights and reporting</p>
          </div>
        </div>
      </div>
    </main>
  );
}