import { createWalletClient, getAddress, http, publicActions } from 'viem'

import { getNeoxTokenBalance } from './getNeoxTokenBalance'
import { getNeoxWallet } from './getNeoxWallet'
import { neoxChain } from './types'

export async function transferNeoxToken({
  tokenAddress: tokenAddressStr,
  toAddress: toAddressStr,
  amount,
  userId,
  rpcUrl,
}: {
  tokenAddress?: string
  toAddress: string
  amount: bigint
  userId: string
  rpcUrl: string
}) {
  const { account, walletAddress } = getNeoxWallet(userId)
  const client = createWalletClient({
    account,
    chain: neoxChain,
    transport: http(rpcUrl),
  }).extend(publicActions)

  const tokenAddress = tokenAddressStr ? getAddress(tokenAddressStr) : undefined
  const toAddress = getAddress(toAddressStr)

  const { balance } = await getNeoxTokenBalance({ walletAddress, rpcUrl, tokenAddress })

  if (balance < amount) {
    throw new Error('Insufficient balance')
  }

  if (!tokenAddress) {
    return await client.sendTransaction({
      account,
      to: toAddress,
      value: amount,
    })
  }

  return await client.writeContract({
    address: tokenAddress,
    abi: [
      {
        name: 'transfer',
        type: 'function',
        inputs: [
          { name: 'recipient', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'bool' }],
      },
    ],
    functionName: 'transfer',
    args: [toAddress, amount],
  })
}
