"use client";

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useConnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { mintDataset } from '@/lib/contracts';
import { smartUpload } from '@/lib/storage';

export default function Upload() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { connectors, connect, isPending: isConnecting } = useConnect();

  const [cid, setCid] = useState('');
  const [sha256sum, setSha] = useState('');
  const [licenseUri, setLicenseUri] = useState('');
  const [domain, setDomain] = useState('');
  const [tags, setTags] = useState('');
  const [verified, setVerified] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requiredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? '31337');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!address) {
      setError('Please connect your wallet');
      return;
    }
    if (chainId !== requiredChainId) {
      setError('Please switch network');
      return;
    }
    if (!cid.trim()) {
      setError('CID is required');
      return;
    }
    if (sha256sum && !/^([A-Fa-f0-9]{64})$/.test(sha256sum.trim())) {
      setError('SHA-256 must be 64 hex chars');
      return;
    }
    if (licenseUri && !/^(https?:\/\/|ipfs:\/\/)/i.test(licenseUri.trim())) {
      setError('License URL must start with http(s):// or ipfs://');
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
      };

      const tokenId = await mintDataset({ to: address, meta });
      router.push(`/dataset/${tokenId.toString()}`);
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || 'Failed to mint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-8">
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold">Upload dataset</h2>
        <form onSubmit={onSubmit} className="mt-5 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 grid gap-4">
          {(!address || chainId !== requiredChainId) && (
            <div className="text-amber-300/90 text-sm flex items-center gap-2">
              <span>{!address ? 'Please connect' : 'Please switch network'}</span>
              {!address ? (
                <button type="button" className="px-2 py-1 rounded bg-amber-400 text-black text-sm" onClick={() => connect({ connector: connectors.find(c => c.id === 'injected') ?? connectors[0] })} disabled={isConnecting}>{isConnecting ? 'Connecting…' : 'Connect'}</button>
              ) : (
                <button type="button" className="px-2 py-1 rounded bg-amber-400 text-black text-sm" onClick={() => switchChain({ chainId: requiredChainId })} disabled={isSwitching}>{isSwitching ? 'Switching…' : 'Switch network'}</button>
              )}
            </div>
          )}
          <label className="grid gap-1">
            <span className="text-sm opacity-80">Pick file (demo)</span>
            <input
              type="file"
              onChange={async (e) => {
                const f = e.target.files?.[0] || null;
                setFile(f ?? null);
                if (f) {
                  setError(null);
                  try {
                    const { cid: mcid, sha256, source } = await smartUpload(f);
                    setCid(mcid);
                    setSha(sha256);
                    setError(source === 'ipfs' ? null : 'Using mock storage (IPFS failed)');
                  } catch (err: any) {
                    setError(`Upload failed: ${err.message}`);
                  }
                }
              }}
              className="text-sm"
            />
          </label>
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
              required
              value={sha256sum}
              onChange={(e) => setSha(e.target.value)}
              className="bg-neutral-800 p-2 rounded border border-neutral-700"
              placeholder="optional checksum (64 hex)"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm opacity-80">License URL</span>
            <input
              type="text"
              required
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
              disabled={submitting || !address || chainId !== requiredChainId}
              className="px-4 py-2 rounded bg-emerald-400 text-black disabled:opacity-60"
            >
              {submitting ? 'Minting…' : 'Mint DataNFT'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
