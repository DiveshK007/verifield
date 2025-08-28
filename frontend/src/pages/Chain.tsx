import { useBlockNumber, useChainId } from 'wagmi'
export default function Chain(){
  const { data: bn } = useBlockNumber({ watch:true })
  const id = useChainId()
  return <div style={{padding:24}}>
    <h1>Chain Status</h1>
    <div>Chain ID: <b>{id}</b></div>
    <div>Block: <b>{bn?.toString() ?? '...'}</b></div>
  </div>
}
