import { useOpenAuth } from '@open-auth/sdk-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfileCard() {
  const { globalConfig, client, profile, logOut } = useOpenAuth()

  const { data: walletData } = useQuery({
    queryKey: ['getUserWallet', profile?.id],
    queryFn: () => client.user.getWallets(),
    enabled: !!profile && client.user.isAuthorized(),
  })

  if (!profile || !walletData) {
    return null
  }

  return (
    <Card className="px-12 py-10 shadow">
      <CardHeader>
        <CardTitle className="text-2xl">
          <span className="font-400">Welcome to</span>
          {' '}
          <span className="font-bold">{globalConfig?.brand}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="mx-auto flex flex-col gap-y-6">
        <div>
          <img src={profile.avatar ?? ''} className="h-12 w-12" alt="" />
        </div>
        <div>
          <div className="text-sm opacity-60">User ID:</div>
          <div>{profile.id.toString()}</div>
        </div>
        <div>
          <div className="text-sm opacity-60">Display Name:</div>
          <div>{profile.displayName}</div>
        </div>
        <div>
          <div className="text-sm opacity-60">NEO X Wallet:</div>
          <div>{walletData?.walletAddress}</div>
        </div>
        <div>
          <Button onClick={logOut}>Log Out</Button>
        </div>
      </CardContent>
    </Card>
  )
}
