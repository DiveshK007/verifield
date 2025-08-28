import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import abi from '@/lib/abis/DataNFT'
const DATANFT = import.meta.env.VITE_DATANFT_ADDRESS

export default function Mint(){
  const { isConnected } = useAccount()
  const [name, setName] = useState('Demo Dataset')
  const [uri, setUri] = useState('ipfs://bafy...')
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return <div style={{padding:24,maxWidth:560}}>
    <h1>Mint DataNFT</h1>
    <label>Name</label>
    <input value={name} onChange={e=>setName(e.target.value)} style={{display:'block',width:'100%',margin:'6px 0 16px',padding:8}}/>
    <label>URI</label>
    <input value={uri} onChange={e=>setUri(e.target.value)} style={{display:'block',width:'100%',margin:'6px 0 16px',padding:8}}/>
    <button
      onClick={()=>{ if(!DATANFT) return alert('Missing VITE_DATANFT_ADDRESS'); writeContract({ address: DATANFT as `0x${string}`, abi: (abi as unknown), functionName: 'mint', args: [name, uri] }) }}
      disabled={!isConnected || isPending || confirming}
      style={{padding:'10px 16px'}}
    >{isPending?'Confirm in wallet...':confirming?'Confirming...':'Mint'}</button>
    {hash && <div style={{marginTop:12}}>tx: <code>{hash}</code></div>}
    {isSuccess && <div style={{marginTop:8, color:'green'}}>Minted ✅</div>}
    {error && <div style={{marginTop:8, color:'crimson'}}>{String(error.message||error)}</div>}
  </div>
}
