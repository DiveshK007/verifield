// components/Header.tsx
'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { chain as configuredChain } from '../lib/wagmi';

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const injected = connectors.find(c => c.id === 'injected') ?? connectors[0];
  const onWrongChain = isConnected && chainId !== configuredChain.id;

  return (
    <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-3">
      <a href="/" className="font-semibold">Verifield</a>
      <div className="ml-auto flex items-center gap-3">
        {onWrongChain && (
          <div className="text-amber-300/90 text-sm flex items-center gap-2">
            <span>Wrong network</span>
            <button
              className="px-2 py-1 rounded bg-amber-400 text-black text-sm"
              onClick={() => switchChain({ chainId: configuredChain.id })}
              disabled={isSwitching}
            >
              {isSwitching ? 'Switching…' : 'Switch to Local'}
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
          <>
            <span className="text-sm opacity-80">{address?.slice(0,6)}…{address?.slice(-4)}</span>
            <button onClick={() => disconnect()} className="px-2 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-sm">Disconnect</button>
          </>
        )}
      </div>
    </div>
  );
}

