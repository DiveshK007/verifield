"use client";

import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { dataNftAbi } from '../../../lib/abis/DataNFT';
import { getDataNftAddress } from '../../../lib/contracts';

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

  const { data, error, isPending } = useReadContract({
    address: address ?? undefined,
    abi: dataNftAbi,
    functionName: 'getDataset',
    args: tokenId ? [tokenId] : undefined,
    query: { enabled: Boolean(address && tokenId) },
  });

  const dataset = data as
    | {
        cid: string;
        sha256sum: string;
        licenseUri: string;
        domain: string;
        tags: string[];
        verified: boolean;
      }
    | undefined;

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
            </dl>
          </div>
        )}
      </div>
    </main>
  );
}
