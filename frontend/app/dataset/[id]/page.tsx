"use client";

import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { readDataset, setVerified } from '@/lib/contracts';
import { resolveCidUrl } from '@/lib/storage';
import VerificationBadge from '@/components/VerificationBadge';

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

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
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
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm" href={resolveCidUrl(dsQ.data.cid)} target="_blank" rel="noreferrer">Open dataset</a>
              <button
                className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-sm"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Copy share link
              </button>
              {isOwner && (
                <button
                  className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-sm"
                  onClick={async () => {
                    await setVerified({ tokenId: tokenId!, value: !dsQ.data!.verified });
                    await qc.invalidateQueries({ queryKey: ['dataset', tokenId?.toString()] });
                  }}
                >
                  {dsQ.data.verified ? 'Unverify' : 'Mark Verified'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
