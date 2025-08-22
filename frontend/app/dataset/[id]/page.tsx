"use client";

import { useMemo, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { readDataset } from '@/lib/contracts';
import { resolveCidUrl } from '@/lib/storage';
import { dataNftAbi } from '@/lib/abis/DataNFT';
import { marketplaceAbi } from '@/lib/abis/Marketplace';
import { getDataNftAddress } from '@/lib/contracts';
import { chain as configuredChain } from '@/lib/wagmi';
import VerificationBadge from '@/components/VerificationBadge';
import SuggestionBox from '@/components/SuggestionBox';
import { useToast } from '@/components/Toast';
import { formatEther, parseEther } from 'viem';

function short(addr?: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function DatasetPage({ params }: { params: { id: string } }) {
  const tokenId = useMemo(() => {
    const n = Number(params.id);
    return Number.isFinite(n) && n > 0 ? BigInt(n) : null;
  }, [params.id]);

  const qc = useQueryClient();
  const { address } = useAccount();
  const { addToast } = useToast();

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read marketplace data
  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;
  
  const { data: itemStats } = useReadContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'getItemStats',
    args: tokenId ? [tokenId] : undefined,
    query: { enabled: !!tokenId },
  });

  const { data: ownerSummary } = useReadContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'getUserSummary',
    args: tokenId ? [address as `0x${string}`] : undefined,
    query: { enabled: !!tokenId && !!address },
  });

  const dsQ = useQuery({
    queryKey: ['dataset', tokenId?.toString()],
    enabled: Boolean(tokenId),
    queryFn: async () => {
      try {
        return await readDataset(tokenId!);
      } catch (e: any) {
        if (/bad token/i.test(String(e?.message))) return null;
        throw e;
      }
    },
  });

  const isOwner = address && dsQ.data && address.toLowerCase() === dsQ.data.owner.toLowerCase();

  const handleSetVerified = async (value: boolean) => {
    if (!tokenId) return;
    
    writeContract({
      address: getDataNftAddress(),
      abi: dataNftAbi,
      functionName: 'setVerified',
      args: [tokenId, value],
      chain: configuredChain,
      account: address as `0x${string}`,
    });
  };

  const handlePurchase = async () => {
    if (!tokenId) return;
    
    // Default price for demo - in production this would come from the dataset metadata or a price oracle
    const price = parseEther("0.01"); // 0.01 ETH

    addToast({
      type: 'info',
      title: 'Purchasing Dataset',
      message: 'Please confirm the transaction in your wallet',
      duration: 5000,
    });

    try {
      writeContract({
        address: marketplaceAddress,
        abi: marketplaceAbi,
        functionName: 'purchase',
        args: [tokenId],
        value: price,
        chain: configuredChain,
        account: address as `0x${string}`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Purchase Failed',
        message: err?.shortMessage || err?.message || 'Transaction failed',
        duration: 5000,
      });
    }
  };

  const handleWithdrawCredits = async () => {
    if (!marketplaceAddress) return;

    addToast({
      type: 'info',
      title: 'Withdrawing Credits',
      message: 'Please confirm the transaction in your wallet',
      duration: 5000,
    });

    try {
      writeContract({
        address: marketplaceAddress,
        abi: marketplaceAbi,
        functionName: 'withdrawCredits',
        chain: configuredChain,
        account: address as `0x${string}`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Withdrawal Failed',
        message: err?.shortMessage || err?.message || 'Transaction failed',
        duration: 5000,
      });
    }
  };

  // Handle successful transaction
  if (isSuccess) {
    addToast({
      type: 'success',
      title: 'Transaction Successful!',
      message: 'Your action has been completed',
      duration: 4000,
    });
    qc.invalidateQueries({ queryKey: ['dataset', tokenId?.toString()] });
  }

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Data #{params.id}</h2>
          {dsQ.data && <VerificationBadge verified={dsQ.data.verified} domain={dsQ.data.domain} />}
        </div>

        {dsQ.isPending && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-28 rounded bg-neutral-900/40 border border-neutral-800 animate-pulse" />
            <div className="h-28 rounded bg-neutral-900/40 border border-neutral-800 animate-pulse" />
          </div>
        )}

        {!dsQ.isPending && dsQ.data === null && (
          <div className="mt-6 rounded border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="text-lg font-medium">Not found</div>
            <div className="opacity-80 mt-1">This dataset does not exist.</div>
            <a href="/" className="mt-4 inline-block underline">Go home</a>
          </div>
        )}

        {!dsQ.isPending && dsQ.data && (
          <>
            <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-70">Owner</div>
                  <div className="mt-1">{short(dsQ.data.owner)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">CID</div>
                  <div className="mt-1 break-all flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-neutral-800/70 border border-neutral-700">{dsQ.data.cid}</span>
                    <button 
                      className="text-xs px-1 py-0.5 rounded border border-neutral-700 hover:bg-neutral-800"
                      onClick={() => navigator.clipboard.writeText(dsQ.data!.cid)}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-70">License</div>
                  <div className="mt-1 break-all">
                    <a className="underline" href={dsQ.data.licenseUri} target="_blank" rel="noreferrer">{dsQ.data.licenseUri}</a>
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Domain</div>
                  <div className="mt-1">{dsQ.data.domain || '-'}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Tags</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(dsQ.data.tags || []).length ? dsQ.data.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-sm bg-neutral-800/70 border border-neutral-700">{t}</span>
                    )) : <span>-</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Verified</div>
                  <div className="mt-1">{dsQ.data.verified ? <span className="text-emerald-400">Yes ✓</span> : <span className="opacity-80">No</span>}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">SHA-256</div>
                  <div className="mt-1 break-all">{dsQ.data.sha256sum ? `${dsQ.data.sha256sum.slice(0, 12)}…${dsQ.data.sha256sum.slice(-6)}` : '-'}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Sales</div>
                  <div className="mt-1 text-purple-400">{itemStats ? Number(itemStats) : '0'}</div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm" href={resolveCidUrl(dsQ.data.cid)} target="_blank" rel="noreferrer">Open dataset</a>
                <button
                  className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-sm"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  Copy share link
                </button>
                
                {/* Buy Button - Only show if not owner */}
                {!isOwner && (
                  <button
                    className="px-4 py-1.5 rounded bg-purple-500 text-white text-sm hover:bg-purple-600 transition-colors"
                    onClick={handlePurchase}
                    disabled={isConfirming}
                  >
                    {isConfirming ? 'Purchasing...' : 'Buy Dataset (0.01 ETH)'}
                  </button>
                )}
                
                {/* Owner Actions */}
                {isOwner && (
                  <>
                    <button
                      className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-sm"
                      onClick={() => handleSetVerified(!dsQ.data!.verified)}
                      disabled={isConfirming}
                    >
                      {isConfirming ? 'Updating…' : dsQ.data.verified ? 'Unverify' : 'Mark Verified'}
                    </button>
                    
                    {/* Withdraw Credits Button */}
                    {ownerSummary && ownerSummary[2] > 0 && (
                      <button
                        className="px-3 py-1.5 rounded bg-emerald-500 text-black text-sm hover:bg-emerald-600 transition-colors"
                        onClick={handleWithdrawCredits}
                        disabled={isConfirming}
                      >
                        {isConfirming ? 'Withdrawing...' : `Withdraw ${formatEther(ownerSummary[2])} ETH`}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Credits Display for Owner */}
            {isOwner && ownerSummary && (
              <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
                <h3 className="text-lg font-semibold mb-4">Your Credits</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
                    <div className="text-sm text-neutral-400 mb-1">Uploads</div>
                    <div className="text-2xl font-bold text-emerald-400">{Number(ownerSummary[0])}</div>
                  </div>
                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
                    <div className="text-sm text-neutral-400 mb-1">Sales</div>
                    <div className="text-2xl font-bold text-purple-400">{Number(ownerSummary[1])}</div>
                  </div>
                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
                    <div className="text-sm text-neutral-400 mb-1">Credits</div>
                    <div className="text-2xl font-bold text-blue-400">{formatEther(ownerSummary[2])} ETH</div>
                  </div>
                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
                    <div className="text-sm text-neutral-400 mb-1">Owned</div>
                    <div className="text-2xl font-bold text-orange-400">{Number(ownerSummary[3])}</div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            <div className="mt-8">
              <SuggestionBox 
                currentTags={dsQ.data.tags || []}
                currentDomain={dsQ.data.domain || ''}
                currentOwner={dsQ.data.owner}
                title="Similar Datasets"
                maxSuggestions={3}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
