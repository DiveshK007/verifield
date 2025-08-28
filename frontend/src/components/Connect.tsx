import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
export default function Connect(){
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect({ connector: injected() })
  const { disconnect } = useDisconnect()
  if (!isConnected) return <button onClick={()=>connect()} disabled={isPending}>{isPending?'Connecting...':'Connect Wallet'}</button>
  return <div style={{display:'flex',gap:12,alignItems:'center'}}>
    <code>{address}</code>
    <button onClick={()=>disconnect()}>Disconnect</button>
  </div>
}
