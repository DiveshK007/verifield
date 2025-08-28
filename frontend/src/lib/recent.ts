import { useEffect, useMemo, useState } from 'react'
import { createPublicClient, http, Log } from 'viem'
import { hardhat } from './wagmi'
import DataNFTAbi from './abis/DataNFT'

type RecentItem = { tokenId: bigint; name?: string; uri?: string }

export function useRecentDatasets(limit = 12){
  const [items, setItems] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|undefined>()
  const rpc = (import.meta.env as Record<string,string>).VITE_RPC_URL
  const address = (import.meta.env as Record<string,string>).VITE_DATANFT_ADDRESS as `0x${string}`
  const client = useMemo(()=>createPublicClient({ chain: hardhat, transport: http(rpc) }),[rpc])

  useEffect(()=>{
    let cancelled = false
    async function run(){
      setLoading(true); setError(undefined)
      try{
        if(!address){ throw new Error('Missing VITE_DATANFT_ADDRESS') }
        const toTopic = '0x0000000000000000000000000000000000000000000000000000000000000000'
        const logs = await client.getLogs({
          address,
          event: (DataNFTAbi as any).find((e:any)=>e.type==='event'&&e.name==='Transfer'),
          fromBlock: 0n,
          toBlock: 'latest',
        }) as Log[]
        const mints = logs.filter(l=>l.topics?.[1]?.toLowerCase()===toTopic).slice(-limit).reverse()
        const tokenIds = mints.map(l=>BigInt(l.topics![3] as string))
        const results: RecentItem[] = []
        for (const id of tokenIds){
          try{
            const [name, uri] = await Promise.all([
              client.readContract({ address, abi: DataNFTAbi as any, functionName: 'nameOf', args: [id] }) as Promise<string>,
              client.readContract({ address, abi: DataNFTAbi as any, functionName: 'tokenURI', args: [id] }) as Promise<string>,
            ])
            results.push({ tokenId: id, name, uri })
          }catch{
            results.push({ tokenId: id })
          }
        }
        if(!cancelled) setItems(results)
      }catch(e){ if(!cancelled) setError((e as Error).message) }
      finally{ if(!cancelled) setLoading(false) }
    }
    run()
    return ()=>{ cancelled=true }
  },[address, client, limit])

  // Mock fallback when empty or error
  const withFallback = items.length? items : Array.from({length: Math.min(6,limit)}).map((_,i)=>({ tokenId: BigInt(i+1), name: `Demo Dataset #${i+1}`, uri: 'ipfs://demo' }))
  return { items: withFallback, loading, error }
}

