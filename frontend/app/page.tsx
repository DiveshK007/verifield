"use client";

import { usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { dataNftAbi } from '../lib/abis/DataNFT';
import { getDataNftAddress } from '../lib/contracts';

export default function Home() {
  const publicClient = usePublicClient();
  let address: `0x${string}` | null = null;
  let envError: string | null = null;
  try {
    address = getDataNftAddress();
  } catch (e: any) {
    envError = e?.message ?? 'Contract address missing';
  }

  const recentQ = useQuery({
    queryKey: ['recentTokenIds', address],
    enabled: Boolean(address && publicClient),
    queryFn: async () => {
      const toBlock = await publicClient!.getBlockNumber();
      const logs = await publicClient!.getLogs({ address: address!, fromBlock: 0n, toBlock });
      const TRANSFER_TOPIC0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
      const ZERO32 = '0x' + '0'.repeat(64);
      const minted = (logs as any[]).filter((l) => (l.topics?.[0] || '').toLowerCase() === TRANSFER_TOPIC0 && (l.topics?.[1] || '').toLowerCase() === ZERO32);
      const ids = minted.map((l) => BigInt(l.topics[3])).slice(-12);
      return ids;
    },
  });

  const metaQ = useQuery({
    queryKey: ['recentMeta', address, (recentQ.data || []).join(',')],
    enabled: Boolean(address && publicClient && recentQ.data && recentQ.data.length > 0),
    queryFn: async () => {
      const ids = recentQ.data || [];
      const results = await Promise.all(
        ids.map((id) => publicClient!.readContract({ address: address!, abi: dataNftAbi, functionName: 'getDataset', args: [id] }))
      );
      return results.map((value, i) => ({ id: ids[i], value }));
    },
  });

  const pairs = (recentQ.data || []).map((id) => ({ id, meta: metaQ.data?.find((m) => m.id === id)?.value as any }));

  return (
    <main className="p-8">
      <div className="max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">VeriField</h1>
        <p className="opacity-80 mt-2">BNB Greenfield + BSC • Climate & Research datasets</p>
        <div className="mt-6 flex gap-3">
          <a className="px-4 py-2 rounded bg-emerald-400 text-black" href="/upload">Upload dataset</a>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold">Recent datasets</h3>
          {envError && <div className="mt-2 text-amber-300/90 text-sm">{envError}</div>}
          {!envError && recentQ.isPending && <div className="mt-2 opacity-80">Loading…</div>}
          {!envError && !recentQ.isPending && pairs.length === 0 && <div className="mt-2 opacity-80">No datasets yet.</div>}
          {!envError && pairs.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pairs.map(({ id, meta }) => (
                <li key={id.toString()} className="rounded border border-neutral-800 bg-neutral-900/40 p-4">
                  <a href={`/dataset/${id.toString()}`} className="font-medium hover:underline">Data #{id.toString()}</a>
                  {meta?.verified && <span className="ml-2 text-emerald-400 text-sm">✓</span>}
                  <div className="mt-2 text-sm opacity-80 truncate">{meta?.domain || '—'}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(meta?.tags || []).slice(0,3).map((t: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-neutral-800/70 border border-neutral-700">{t}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
