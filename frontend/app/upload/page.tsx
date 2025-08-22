"use client";

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useConnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useRouter } from 'next/navigation';
import { smartUpload } from '@/lib/storage';
import { dataNftAbi } from '@/lib/abis/DataNFT';
import { marketplaceAbi } from '@/lib/abis/Marketplace';
import { getDataNftAddress } from '@/lib/contracts';
import { chain as configuredChain } from '@/lib/wagmi';
import { useToast } from '@/components/Toast';

export default function Upload() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { addToast } = useToast();

  const [cid, setCid] = useState('');
  const [sha256sum, setSha] = useState('');
  const [licenseUri, setLicenseUri] = useState('');
  const [domain, setDomain] = useState('');
  const [tags, setTags] = useState('');
  const [verified, setVerified] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const requiredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? '31337');
  const [submitting, setSubmitting] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!address) {
      setError('Please connect your wallet');
      setSubmitting(false);
      return;
    }
    if (chainId !== requiredChainId) {
      setError('Please switch network');
      setSubmitting(false);
      return;
    }
    if (!cid.trim()) {
      setError('CID is required');
      setSubmitting(false);
      return;
    }
    if (sha256sum && !/^([A-Fa-f0-9]{64})$/.test(sha256sum.trim())) {
      setError('SHA-256 must be 64 hex chars');
      setSubmitting(false);
      return;
    }
    if (licenseUri && !/^(https?:\/\/|ipfs:\/\/)/i.test(licenseUri.trim())) {
      setError('License URL must start with http(s):// or ipfs://');
      setSubmitting(false);
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

      addToast({
        type: 'info',
        title: 'Minting DataNFT',
        message: 'Please confirm the transaction in your wallet',
        duration: 5000,
      });

      writeContract({
        address: getDataNftAddress(),
        abi: dataNftAbi,
        functionName: 'mint',
        args: [address, meta],
        chain: configuredChain,
        account: address as `0x${string}`,
      });
    } catch (err: any) {
      const errorMsg = err?.shortMessage || err?.message || 'Failed to mint';
      setError(errorMsg);
      setSubmitting(false);
      
      addToast({
        type: 'error',
        title: 'Minting Failed',
        message: errorMsg,
        duration: 5000,
      });
    }
  };

    // Handle successful mint - call bumpUpload to track user stats
  if (isSuccess && hash && marketplaceAddress) {
    addToast({
      type: 'success',
      title: 'DataNFT Minted Successfully!',
      message: 'Your dataset has been uploaded to the blockchain',
      duration: 6000,
    });

    // Call bumpUpload to increment user's upload count
    writeContract({
      address: marketplaceAddress,
      abi: marketplaceAbi,
      functionName: 'bumpUpload',
      args: [address as `0x${string}`],
      chain: configuredChain,
      account: address as `0x${string}`,
    });

    // Redirect to the new dataset (we'll use a placeholder for now)
    setTimeout(() => {
      router.push('/dataset/1');
    }, 2000);
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setError(null);
    
    addToast({
      type: 'info',
      title: 'Processing File',
      message: 'Uploading to IPFS and calculating hash...',
      duration: 3000,
    });
    
    try {
      const { cid, sha256 } = await smartUpload(selectedFile);
      setCid(cid);
      setSha(sha256);
      
      addToast({
        type: 'success',
        title: 'File Processed Successfully',
        message: 'CID and SHA-256 hash generated',
        duration: 4000,
      });
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message,
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Upload Your Dataset</h1>
          <p className="text-xl text-neutral-400">Share your research data with the scientific community</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={onSubmit} className="space-y-8">
            {/* File Upload Section */}
            <div>
              <label className="block text-lg font-semibold text-white mb-4">Dataset File</label>
              
              {/* Drag & Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                  isDragActive 
                    ? 'border-emerald-400 bg-emerald-500/10' 
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                      <p className="text-emerald-400 font-medium">Processing file...</p>
                    </div>
                  ) : file ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-neutral-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setCid('');
                          setSha('');
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-3xl">📁</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg mb-2">
                          Drag & drop your file here
                        </p>
                        <p className="text-neutral-400 mb-4">or click to browse</p>
                        <input
                          type="file"
                          id="file-input"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileSelect(f);
                          }}
                        />
                        <label
                          htmlFor="file-input"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          <span>📤</span>
                          Choose File
                        </label>
                      </div>
                      <p className="text-xs text-neutral-500">Supports all file types • Max 100MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Content Identifier (CID)</label>
                <input
                  type="text"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  placeholder="bafybeig..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-neutral-500 mt-2">Auto-generated from file upload</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">SHA-256 Hash</label>
                <input
                  type="text"
                  value={sha256sum}
                  onChange={(e) => setSha(e.target.value)}
                  placeholder="64 hex characters"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-neutral-500 mt-2">File integrity verification</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">License URI</label>
                <input
                  type="text"
                  value={licenseUri}
                  onChange={(e) => setLicenseUri(e.target.value)}
                  placeholder="https://creativecommons.org/licenses/by/4.0/"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-neutral-500 mt-2">Data usage license</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">Research Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">Select domain</option>
                  <option value="climate">Climate Science</option>
                  <option value="health">Healthcare & Medicine</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="biology">Biology & Life Sciences</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="social">Social Sciences</option>
                  <option value="economics">Economics</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-xs text-neutral-500 mt-2">Primary research category</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="machine learning, neural networks, classification..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-neutral-500 mt-2">Comma-separated keywords for discoverability</p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                id="verified"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="w-5 h-5 rounded bg-white/10 border border-white/20 text-emerald-500 focus:ring-emerald-500 focus:ring-2"
              />
              <div>
                <label htmlFor="verified" className="text-white font-medium cursor-pointer">
                  Mark as verified
                </label>
                <p className="text-xs text-neutral-400">I certify this dataset is accurate and properly sourced</p>
              </div>
            </div>

            {/* Connection Status */}
            {!address && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-amber-300 font-medium">Wallet Connection Required</p>
                    <p className="text-amber-400 text-sm">Connect your wallet to upload datasets</p>
                  </div>
                </div>
              </div>
            )}

            {chainId !== requiredChainId && address && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔗</span>
                    <div>
                      <p className="text-red-300 font-medium">Wrong Network</p>
                      <p className="text-red-400 text-sm">Switch to chain {requiredChainId}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchChain({ chainId: requiredChainId })}
                    disabled={isSwitching}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isSwitching ? 'Switching...' : 'Switch Network'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <span className="text-xl">❌</span>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !address || chainId !== requiredChainId || isConfirming || !cid}
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Preparing...
                  </span>
                ) : isConfirming ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Minting NFT...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <span>🚀</span>
                    Mint DataNFT
                  </span>
                )}
              </button>
              
              {address && chainId === requiredChainId && (
                <p className="text-center text-neutral-400 text-sm mt-3">
                  Your dataset will be minted as an NFT and stored on the blockchain
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Helper Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl mb-3">🔒</div>
            <h3 className="text-white font-semibold mb-2">Secure & Decentralized</h3>
            <p className="text-neutral-400 text-sm">Your data is stored on IPFS and secured by blockchain technology</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="text-white font-semibold mb-2">Monetize Your Data</h3>
            <p className="text-neutral-400 text-sm">Earn credits when researchers purchase and use your datasets</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="text-white font-semibold mb-2">AI-Powered Discovery</h3>
            <p className="text-neutral-400 text-sm">Your data becomes discoverable through intelligent recommendations</p>
          </div>
        </div>
      </div>
    </main>
  );
}
