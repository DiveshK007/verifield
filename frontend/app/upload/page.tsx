"use client";

import { useState } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { useRouter } from 'next/navigation';
import { decodeEventLog } from 'viem';
import { getDataNftAddress, dataNftAbi } from '../../lib/contracts';

export default function Upload() {
  const router = useRouter();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [cid, setCid] = useState('');
  const [sha256sum, setSha] = useState('');
  const [licenseUri, setLicenseUri] = useState('');
  const [domain, setDomain] = useState('');
  const [tags, setTags] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let dataNftAddress: `0x${string}` | null = null;
  let envError: string | null = null;
  try {
    dataNftAddress = getDataNftAddress();
  } catch (e: any) {
    envError = e?.message ?? 'Contract address missing';
  }

  const { writeContractAsync, isPending } = useWriteContract();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!dataNftAddress) {
      setError(envError || 'Contract address not configured');
      return;
    }
    if (!address) {
      setError('Connect your wallet first');
      return;
    }
    if (!cid.trim()) {
      setError('CID is required');
      return;
    }
    try {
      const meta = {
        cid: cid.trim(),
        sha256sum: sha256sum.trim(),
        licenseUri: licenseUri.trim(),
        domain: domain.trim(),
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        verified,
      } as const;

      const hash = await writeContractAsync({
        address: dataNftAddress,
        abi: dataNftAbi,
        functionName: 'mint',
        args: [address, meta],
      });

      const receipt = await publicClient!.waitForTransactionReceipt({ hash });

      let tokenId: string | null = null;
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== dataNftAddress.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({ abi: dataNftAbi, data: log.data, topics: log.topics });
          if (decoded.eventName === 'Minted') {
            const tid = (decoded.args as any).tokenId as bigint;
            tokenId = tid?.toString();
            break;
          }
        } catch (_) {}
      }

      router.push(`/dataset/${tokenId ?? ''}`);
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || 'Failed to mint');
    }
  };

  return (
    <main className="p-8">
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold">Upload dataset</h2>
        <form onSubmit={onSubmit} className="mt-5 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 grid gap-4">
          {envError && (
            <div className="text-amber-300/90 text-sm">{envError}</div>
          )}
          <label className="grid gap-1">
            <span className="text-sm opacity-80">CID *</span>
            <input
              type="text"
              required
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              className="bg-neutral-800 p-2 rounded border border-neutral-700"
              placeholder="bafy..."
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm opacity-80">SHA-256</span>
            <input
              type="text"
              value={sha256sum}
              onChange={(e) => setSha(e.target.value)}
              className="bg-neutral-800 p-2 rounded border border-neutral-700"
              placeholder="optional checksum"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm opacity-80">License URL</span>
            <input
              type="text"
              value={licenseUri}
              onChange={(e) => setLicenseUri(e.target.value)}
              className="bg-neutral-800 p-2 rounded border border-neutral-700"
              placeholder="https://... or ipfs://..."
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm opacity-80">Domain</span>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-neutral-800 p-2 rounded border border-neutral-700"
              placeholder="e.g. climate"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm opacity-80">Tags</span>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-neutral-800 p-2 rounded border border-neutral-700"
              placeholder="comma,separated,tags"
            />
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            <span className="text-sm">Verified</span>
          </label>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending || Boolean(envError)}
              className="px-4 py-2 rounded bg-emerald-400 text-black disabled:opacity-60"
            >
              {isPending ? 'Minting…' : 'Mint DataNFT'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
