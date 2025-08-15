import { createConfig, http } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [bscTestnet],
  transports: { [bscTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL) },
})
