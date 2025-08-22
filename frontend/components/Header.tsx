// components/Header.tsx
'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { chain as configuredChain } from '../lib/wagmi';
import { getDataNftAddress } from '../lib/contracts';

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const injected = connectors.find(c => c.id === 'injected') ?? connectors[0];
  const onWrongChain = isConnected && chainId !== configuredChain.id;
  let addrMissing = false;
  try { getDataNftAddress(); } catch (_) { addrMissing = true; }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm">VF</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                VeriField
              </span>
            </a>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="/upload" className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                Upload
              </a>
              <a href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                Dashboard
              </a>
              <a href="/profile" className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                Profile
              </a>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Chain indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/50 border border-neutral-700/50">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-xs text-neutral-400">Chain {configuredChain.id}</span>
            </div>

            {/* Warnings */}
            {addrMissing && (
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs">
                ⚠️ Config needed
              </div>
            )}
            
            {onWrongChain && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                <span className="text-red-300 text-sm">Wrong network</span>
                <button
                  className="px-2 py-1 rounded bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                  onClick={() => switchChain({ chainId: configuredChain.id })}
                  disabled={isSwitching}
                >
                  {isSwitching ? 'Switching...' : 'Switch'}
                </button>
              </div>
            )}

            {/* Wallet connection */}
            {!isConnected ? (
              <button
                onClick={() => connect({ connector: injected })}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connecting...
                  </span>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                    <span className="text-black text-xs font-bold">
                      {address?.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-neutral-300">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <button 
                  onClick={() => disconnect()} 
                  className="px-3 py-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700/50 transition-all duration-200"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

