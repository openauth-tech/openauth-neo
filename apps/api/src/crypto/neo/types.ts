import type { Chain } from 'viem'
import { defineChain } from 'viem'

export const neoxChain: Chain = defineChain({
  id: 47763,
  name: 'Neo X Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'GAS',
    symbol: 'GAS',
  },
  rpcUrls: {
    default: { http: ['https://mainnet-1.rpc.banelabs.org'] },
  },
})
