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
    <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/80 bg-neutral-950/95 px-4 py-3 border-b border-neutral-800 flex items-center gap-3">
      <a href="/" className="font-semibold">Verifield</a>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs opacity-60">Chain: {configuredChain.id}</span>
        {addrMissing && (
          <div className="text-amber-300/90 text-xs">Set NEXT_PUBLIC_DATANFT_ADDRESS</div>
        )}
        {onWrongChain && (
          <div className="text-amber-300/90 text-sm flex items-center gap-2">
            <span>Wrong network</span>
            <button
              className="px-2 py-1 rounded bg-amber-400 text-black text-sm"
              onClick={() => switchChain({ chainId: configuredChain.id })}
              disabled={isSwitching}
            >
              {isSwitching ? 'Switching…' : `Switch`}
            </button>
          </div>
        )}

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected })}
            disabled={isPending}
            className="px-3 py-1.5 rounded bg-emerald-400 text-black"
          >
            {isPending ? 'Connecting…' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80 px-2 py-1 rounded-full bg-neutral-800 border border-neutral-700">{address?.slice(0,6)}…{address?.slice(-4)}</span>
            <button onClick={() => disconnect()} className="px-2 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-sm">Disconnect</button>
          </div>
        )}
      </div>
    </div>
  );
}

