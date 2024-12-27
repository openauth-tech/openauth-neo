import { createPublicClient, erc20Abi, formatEther, formatUnits, http, publicActions } from 'viem'

import { neoxChain } from './types'

export async function getNeoxTokenBalance({
  tokenAddress,
  walletAddress,
  rpcUrl,
}: {
  tokenAddress?: `0x${string}`
  walletAddress: `0x${string}`
  rpcUrl: string
}) {
  const chain = neoxChain
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  }).extend(publicActions)

  if (!tokenAddress) {
    const balance = await client.getBalance({ address: walletAddress })

    return {
      uiBalance: Number.parseFloat(formatEther(balance)),
      balance,
      decimals: 18,
    }
  }

  const decimals = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const balance = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [walletAddress],
  })

  return {
    uiBalance: Number.parseFloat(formatUnits(balance, decimals)),
    balance,
    decimals,
  }
}
