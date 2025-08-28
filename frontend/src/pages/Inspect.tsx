import { useState } from 'react'
import { useReadContract } from 'wagmi'
import abi from '@/lib/abis/DataNFT'
const DATANFT = import.meta.env.VITE_DATANFT_ADDRESS

export default function Inspect(){
  const [id, setId] = useState<number>(0)
  const { data: name } = useReadContract({ address: DATANFT as `0x${string}`, abi: (abi as unknown), functionName: 'nameOf', args: [BigInt(id||0)] })
  const { data: uri }  = useReadContract({ address: DATANFT as `0x${string}`, abi: (abi as unknown), functionName: 'tokenURI', args: [BigInt(id||0)] })
  return <div style={{padding:24,maxWidth:560}}>
    <h1>Inspect DataNFT</h1>
    <label>Token ID</label>
    <input onChange={e=>setId(Number(e.target.value||0))} style={{display:'block',width:'100%',margin:'6px 0 16px',padding:8}}/>
    <div>Name: <b>{String(name??'-')}</b></div>
    <div style={{marginTop:8}}>URI: <code>{String(uri??'-')}</code></div>
  </div>
}
