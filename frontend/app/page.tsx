"use client";

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { readDataset, readLastTokenId } from '@/lib/contracts';
import DatasetStats from '@/components/DatasetStats';
import VerificationBadge from '@/components/VerificationBadge';

export default function Home() {
  const lastQ = useQuery({
    queryKey: ['lastId'],
    queryFn: () => readLastTokenId(),
  });

  const ids = useMemo(() => {
    const last = lastQ.data || 0n;
    const max = 12;
    const list: bigint[] = [];
    for (let i = 0; i < max && last - BigInt(i) > 0; i++) list.push(last - BigInt(i));
    return list;
  }, [lastQ.data]);

  const metasQ = useQuery({
    queryKey: ['metas', ids.join(',')],
    enabled: ids.length > 0,
    queryFn: async () => Promise.all(ids.map((id) => readDataset(id).catch(() => null))),
  });

  const items = (metasQ.data || []).map((m, i) => ({ id: ids[i], meta: m }));
  const domains = Array.from(new Set(items.filter(i => i.meta).map(i => i.meta!.domain))).sort();
  const [filter, setFilter] = useState<string>('');
  const filtered = items.filter(i => !i.meta ? false : !filter || i.meta.domain === filter);

  return (
    <main className="p-8">
      <div className="max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">VeriField</h1>
        <p className="opacity-80 mt-2">BNB Greenfield + BSC • Climate & Research datasets</p>
        <div className="mt-6 flex gap-3">
          <a className="px-4 py-2 rounded bg-emerald-400 text-black" href="/upload">Upload dataset</a>
          <a className="px-4 py-2 rounded border border-neutral-700 bg-neutral-900/40" href="/dataset/1">View example dataset</a>
        </div>

        <div className="mt-10">
          <DatasetStats />
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm">
          <button className={`px-2 py-1 rounded border ${filter === '' ? 'bg-neutral-800 border-neutral-600' : 'border-neutral-700'}`} onClick={() => setFilter('')}>All</button>
          {domains.map((d) => (
            <button key={d} className={`px-2 py-1 rounded border ${filter === d ? 'bg-neutral-800 border-neutral-600' : 'border-neutral-700'}`} onClick={() => setFilter(d)}>{d}</button>
          ))}
        </div>

        <div className="mt-6">
          {(lastQ.isPending || metasQ.isPending) && <div className="opacity-80">Loading…</div>}
          {!lastQ.isPending && ids.length === 0 && <div className="opacity-80">No datasets yet.</div>}
          {filtered.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(({ id, meta }) => (
                <li key={id.toString()} className="rounded border border-neutral-800 bg-neutral-900/40 p-4 hover:bg-neutral-900/60 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <a href={`/dataset/${id.toString()}`} className="font-medium hover:underline">Data #{id.toString()}</a>
                    <VerificationBadge verified={meta?.verified || false} size="sm" />
                  </div>
                  <div className="text-sm opacity-80 truncate mb-2">{meta?.domain || '—'}</div>
                  <div className="flex flex-wrap gap-1">
                    {(meta?.tags || []).slice(0,2).map((t: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-neutral-800/70 border border-neutral-700">{t}</span>
                    ))}
                    {(meta?.tags || []).length > 2 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-800/70 border border-neutral-700 opacity-60">
                        +{(meta?.tags || []).length - 2} more
                      </span>
                    )}
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
