import { SocialAccountCard } from '../components/SocialAccountCard'
import { useSocialAccounts } from '../hooks/useSocialAccounts'
import { LoadingState } from '@/shared/models/LoadingState'
import { Loader2 } from 'lucide-react'

const SocialAccountsPage = () => {
  const {
    loading,
    facebookAccounts,
    instagramAccounts,
    tiktokAccounts,
    handleConnect,
    handleDisconnect,
  } = useSocialAccounts()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Social Accounts</h1>
        <p className="mt-2 text-gray-500">Connect your social media accounts to start scheduling posts.</p>
      </div>

      {loading === LoadingState.pending && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      )}

      {loading !== LoadingState.pending && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <SocialAccountCard
            platform="facebook"
            accounts={facebookAccounts}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          <SocialAccountCard
            platform="instagram"
            accounts={instagramAccounts}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          <SocialAccountCard
            platform="tiktok"
            accounts={tiktokAccounts}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
      )}
    </div>
  )
}

export default SocialAccountsPage
