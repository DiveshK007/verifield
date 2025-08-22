'use client';

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { readRecentTokenIds, readDataset } from '@/lib/contracts';
import { marketplaceAbi } from '@/lib/abis/Marketplace';
import StatsCard from '@/components/StatsCard';
import VerificationBadge from '@/components/VerificationBadge';
import { formatEther } from 'viem';

export default function Profile() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'datasets' | 'purchases' | 'activity'>('datasets');

  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

  // Get user summary
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

  if (!address) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet to View Profile</h2>
            <p className="text-neutral-400">Your research profile and achievements await</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <span className="text-black font-bold text-2xl">
                  {address.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-black text-sm">✓</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">Research Profile</h1>
              <p className="text-neutral-400 font-mono text-sm mb-4">
                {address.slice(0, 8)}...{address.slice(-8)}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span className="text-emerald-300 text-sm">Active Researcher</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <span className="text-blue-300 text-sm">Member since 2024</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {userSummary ? Number(userSummary[0]) : 0}
                </div>
                <div className="text-xs text-neutral-400">Uploads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {userSummary ? Number(userSummary[1]) : 0}
                </div>
                <div className="text-xs text-neutral-400">Sales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Earnings"
            value={userSummary ? `${formatEther(userSummary[2])} ETH` : '0 ETH'}
            subtitle="Available credits"
            icon="💰"
            color="emerald"
            size="lg"
          />
          <StatsCard
            title="Impact Score"
            value={userSummary ? Number(userSummary[1]) * 10 + Number(userSummary[0]) * 5 : 0}
            subtitle="Research influence"
            icon="📈"
            color="blue"
            size="lg"
          />
          <StatsCard
            title="Success Rate"
            value={userSummary && userSummary[0] > 0 
              ? `${Math.round((Number(userSummary[1]) / Number(userSummary[0])) * 100)}%`
              : '0%'}
            subtitle="Datasets sold"
            icon="🎯"
            color="purple"
            size="lg"
          />
          <StatsCard
            title="Collection"
            value={userSummary ? Number(userSummary[3]) : 0}
            subtitle="Owned datasets"
            icon="📚"
            color="orange"
            size="lg"
          />
        </div>

        {/* Placeholder for now */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Profile Features Coming Soon</h3>
          <p className="text-neutral-400">Dataset management, purchase history, and activity tracking</p>
        </div>
      </div>
    </main>
  );
}