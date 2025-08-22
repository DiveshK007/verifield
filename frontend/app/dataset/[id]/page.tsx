"use client";

import { useMemo } from 'react';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { dataNftAbi } from '../../../lib/abis/DataNFT';
import { getDataNftAddress, getStorageGateway } from '../../../lib/contracts';
import { chain as configuredChain } from '../../../lib/wagmi';

function isHttpOrIpfs(url?: string): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url) || /^ipfs:\/\//i.test(url);
}

export default function DatasetPage({ params }: { params: { id: string } }) {
  const tokenId = useMemo(() => {
    const n = Number(params.id);
    return Number.isFinite(n) && n > 0 ? BigInt(n) : null;
  }, [params.id]);

  let address: `0x${string}` | null = null;
  let envError: string | null = null;
  try {
    address = getDataNftAddress();
  } catch (e: any) {
    envError = e?.message ?? 'Contract address missing';
  }

  const publicClient = usePublicClient();
  const { address: wallet } = useAccount();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const datasetQ = useQuery({
    queryKey: ['dataset', address, tokenId?.toString()],
    enabled: Boolean(address && tokenId && publicClient),
    queryFn: async () => {
      const result = await publicClient!.readContract({ address: address!, abi: dataNftAbi, functionName: 'getDataset', args: [tokenId!] });
      return result as {
        cid: string;
        sha256sum: string;
        licenseUri: string;
        domain: string;
        tags: string[];
        verified: boolean;
      };
    },
  });

  const ownerQ = useQuery({
    queryKey: ['ownerOf', address, tokenId?.toString()],
    enabled: Boolean(address && tokenId && publicClient),
    queryFn: async () => publicClient!.readContract({ address: address!, abi: dataNftAbi, functionName: 'ownerOf', args: [tokenId!] }) as Promise<`0x${string}`>,
  });

  const isOwner = wallet && ownerQ.data && wallet.toLowerCase() === ownerQ.data.toLowerCase();
  const dataset = datasetQ.data;
  const error = datasetQ.error as any;
  const isPending = datasetQ.isPending;

  return (
    <main className="p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold">Dataset #{params.id}</h2>

        {envError && (
          <div className="mt-4 text-red-400">{envError}</div>
        )}

        {!envError && isPending && (
          <div className="mt-6 opacity-80">Loading dataset…</div>
        )}

        {!envError && error && (
          <div className="mt-6 text-red-400">{String(error?.message || 'Failed to load')}</div>
        )}

        {!envError && !isPending && !dataset && !error && (
          <div className="mt-6 opacity-80">No dataset found.</div>
        )}

        {!envError && dataset && (
          <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm opacity-70">CID</dt>
                <dd className="mt-1 break-all">
                  <span className="px-2 py-1 rounded bg-neutral-800/70">{dataset.cid}</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm opacity-70">SHA-256</dt>
                <dd className="mt-1 break-all">{dataset.sha256sum || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm opacity-70">License URL</dt>
                <dd className="mt-1 break-all">
                  {isHttpOrIpfs(dataset.licenseUri) ? (
                    <a className="underline" href={dataset.licenseUri} target="_blank" rel="noreferrer">
                      {dataset.licenseUri}
                    </a>
                  ) : (
                    dataset.licenseUri || '-'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm opacity-70">Domain</dt>
                <dd className="mt-1">{dataset.domain || '-'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm opacity-70">Tags</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {(dataset.tags || []).length ? (
                    dataset.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-sm bg-neutral-800/70 border border-neutral-700">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm opacity-70">Verified</dt>
                <dd className="mt-1">
                  {dataset.verified ? (
                    <span className="text-emerald-400">Yes</span>
                  ) : (
                    <span className="opacity-80">No</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm opacity-70">Open</dt>
                <dd className="mt-1">
                  <a className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm" href={`${getStorageGateway()}${dataset.cid}`} target="_blank" rel="noreferrer">Open dataset</a>
                </dd>
              </div>
            </dl>
            {isOwner && (
              <div className="mt-6">
                <button
                  className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-sm"
                  disabled={isWriting}
                  onClick={async () => {
                    try {
                      const hash = await (writeContractAsync as any)({ address: address!, abi: dataNftAbi as any, functionName: 'setVerified', args: [tokenId!, !dataset.verified], account: wallet!, chain: configuredChain });
                      await publicClient!.waitForTransactionReceipt({ hash });
                      await datasetQ.refetch();
                    } catch (e: any) {
                      // no-op, inline error via console
                      console.error(e);
                    }
                  }}
                >
                  {isWriting ? 'Updating…' : dataset.verified ? 'Unverify' : 'Verify'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
