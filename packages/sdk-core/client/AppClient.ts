import { BaseClient } from './BaseClient'

export class AppClient extends BaseClient {
  async createUser(data: { telegram?: string, ethAddress?: string, solAddress?: string }) {
    return (await this.http.post<{ data: { id: string, email: string | null, google: string | null, discord: string | null, tiktok: string | null, github: string | null, huggingface: string | null, twitter: string | null, apple: string | null, telegram: string | null, ethAddress: string | null, solAddress: string | null, username: string | null, referCode: string, avatar: string | null, displayName: string | null, createdAt: number, lastSeenAt: number } }>(`/app/users`, data)).data.data
  }

  async listUsers(params: { page: number, limit: number, search?: string, sortBy?: string, order?: 'asc' | 'desc' }) {
    return (await this.http.get<{ data: Array<{ id: string, email: string | null, google: string | null, discord: string | null, tiktok: string | null, github: string | null, huggingface: string | null, twitter: string | null, apple: string | null, telegram: string | null, ethAddress: string | null, solAddress: string | null, username: string | null, referCode: string, avatar: string | null, displayName: string | null, createdAt: number, lastSeenAt: number }>, meta: { totalItems: number, totalPages: number } }>(`/app/users`, { params })).data
  }

  async searchUsers(data: { ids: string[] } | { referCode: string } | { solAddress: string } | { telegram: string }) {
    return (await this.http.post<{ data: Array<{ id: string, email: string | null, google: string | null, discord: string | null, tiktok: string | null, github: string | null, huggingface: string | null, twitter: string | null, apple: string | null, telegram: string | null, ethAddress: string | null, solAddress: string | null, username: string | null, referCode: string, avatar: string | null, displayName: string | null, createdAt: number, lastSeenAt: number }> }>(`/app/users/search`, data)).data.data
  }

  async getUserReferral(userId: string) {
    return (await this.http.get<{ data: { referralChain: string[], referrals1: string[], referrals2: string[] } }>(`/app/users/${userId}/referral`)).data.data
  }

  async getUserWallets(userId: string) {
    return (await this.http.get<{ data: { walletAddress: string } }>(`/app/users/${userId}/wallets`)).data.data
  }

  async setUserReferrer(userId: string, data: { referCode: string }) {
    return (await this.http.post<{ data: any }>(`/app/users/${userId}/bind-referrer`, data)).data.data
  }

  async getUser(userId: string) {
    return (await this.http.get<{ data: { id: string, email: string | null, google: string | null, discord: string | null, tiktok: string | null, github: string | null, huggingface: string | null, twitter: string | null, apple: string | null, telegram: string | null, ethAddress: string | null, solAddress: string | null, username: string | null, referCode: string, avatar: string | null, displayName: string | null, createdAt: number, lastSeenAt: number } }>(`/app/users/${userId}`)).data.data
  }

  async sendNEOXToken(userId: string, data: { rpcUrl: string, toAddress: string, amount: string, tokenAddress?: string }) {
    return (await this.http.post<{ data: { signature: string } }>(`/app/users/${userId}/neox/send-token`, data)).data.data
  }
}
