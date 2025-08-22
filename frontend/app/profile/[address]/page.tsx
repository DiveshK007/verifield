"use client";

import { useParams } from 'next/navigation';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { readRecentTokenIds, readDataset } from '@/lib/contracts';
import { marketplaceAbi } from '@/lib/abis/Marketplace';
import { chain as configuredChain } from '@/lib/wagmi';
import { formatEther } from 'viem';
import VerificationBadge from '@/components/VerificationBadge';
import StatsCard from '@/components/StatsCard';
import SuggestionBox from '@/components/SuggestionBox';

export default function ProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const { address: connectedAddress } = useAccount();
  const qc = useQueryClient();

  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

  // Read user summary from marketplace
  const { data: userSummary } = useReadContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'getUserSummary',
    args: [address as `0x${string}`],
    query: { enabled: !!address && !!marketplaceAddress },
  });

  // Read owned tokens from marketplace
  const { data: ownedTokens } = useReadContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'getOwnedTokens',
    args: [address as `0x${string}`],
    query: { enabled: !!address && !!marketplaceAddress },
  });

  // Get all datasets to find user's datasets
  const allDatasetsQ = useQuery({
    queryKey: ['allDatasetsForProfile', address],
    queryFn: async () => {
      const ids = await readRecentTokenIds(100);
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
    enabled: !!address,
  });

  // Filter user's datasets
  const userDatasets = allDatasetsQ.data?.filter(
    (dataset: any) => dataset.owner.toLowerCase() === address.toLowerCase()
  ) || [];

  // Handle credit withdrawal
  const { writeContract, data: withdrawHash } = useWriteContract();
  const { isLoading: isWithdrawing, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ 
    hash: withdrawHash 
  });

  const handleWithdrawCredits = async () => {
    if (!marketplaceAddress) return;
    
    writeContract({
      address: marketplaceAddress,
      abi: marketplaceAbi,
      functionName: 'withdrawCredits',
      chain: configuredChain,
      account: connectedAddress as `0x${string}`,
    });
  };

  // Handle successful withdrawal
  if (isWithdrawSuccess) {
    qc.invalidateQueries({ queryKey: ['userSummary', address] });
  }

  if (!address) {
    return (
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12 text-neutral-400">
            <div className="text-2xl mb-2">🔍</div>
            <div>Profile address not found</div>
          </div>
        </div>
      </main>
    );
  }

  if (allDatasetsQ.isPending) {
    return (
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-800 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-neutral-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isOwnProfile = connectedAddress?.toLowerCase() === address.toLowerCase();
  const [uploads, salesCount, credits, ownedCount] = (userSummary as [bigint, bigint, bigint, bigint]) || [0n, 0n, 0n, 0n];

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold text-black">
            {address.slice(2, 4).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <div className="text-lg text-neutral-400 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            {isOwnProfile && (
              <div className="text-sm text-emerald-400 mt-1">This is you</div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Datasets Created" 
            value={Number(uploads)} 
            icon="📊"
            color="emerald"
          />
          <StatsCard 
            title="Total Sales" 
            value={Number(salesCount)} 
            icon="💰"
            color="purple"
          />
          <StatsCard 
            title="Credits Earned" 
            value={`${formatEther(credits)} ETH`} 
            icon="🏆"
            color="blue"
          />
          <StatsCard 
            title="Datasets Owned" 
            value={Number(ownedCount)} 
            icon="📁"
            color="orange"
          />
        </div>

        {/* Withdraw Credits Button (only for own profile) */}
        {isOwnProfile && credits > 0 && (
          <div className="mb-8">
            <button
              onClick={handleWithdrawCredits}
              disabled={isWithdrawing}
              className="px-6 py-3 rounded bg-emerald-500 text-black font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isWithdrawing ? 'Withdrawing...' : `Withdraw ${formatEther(credits)} ETH`}
            </button>
          </div>
        )}

        {/* User's Created Datasets */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Created Datasets</h2>
          {userDatasets.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <div className="text-4xl mb-4">📊</div>
              <div className="text-lg mb-2">No datasets created yet</div>
              <div className="text-sm opacity-70">
                {isOwnProfile ? 'Upload your first dataset to get started' : 'This user hasn\'t created any datasets yet'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDatasets.map((dataset: any, index: number) => (
                <div
                  key={index}
                  className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/dataset/${index + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Data #{index + 1}</span>
                      <VerificationBadge verified={dataset.verified} size="sm" />
                    </div>
                  </div>
                  
                  <div className="text-sm opacity-80 mb-3">
                    {dataset.domain || 'Research'} • {dataset.tags?.slice(0, 2).join(', ') || 'No tags'}
                  </div>
                  
                  <div className="text-xs text-neutral-400">
                    Created by {short(dataset.owner)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Suggestions for this user */}
        <div className="mb-8">
          <SuggestionBox 
            currentTags={userDatasets.flatMap((d: any) => d.tags || [])}
            currentDomain={userDatasets[0]?.domain || ''}
            currentOwner={address}
            title="Recommended for this user"
            maxSuggestions={4}
          />
        </div>
      </div>
    </main>
  );
}

function short(addr?: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
