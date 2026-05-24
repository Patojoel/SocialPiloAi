import { useAppDispatch, useAppSelector } from '@/config/hooks'
import {
  selectAllSocialAccounts,
  selectSocialAccountsLoading,
  selectSocialAccountsByPlatform,
} from '../../../slices/socialAccountSelectors'
import { disconnectSocialAccount } from '../../../usecases/disconnectSocialAccount.usecase'
import { initOAuthConnection } from '../../../usecases/initOAuthConnection.usecase'
import type { Platform } from '../../../models/SocialAccount'

export function useSocialAccounts() {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAllSocialAccounts)
  const loading = useAppSelector(selectSocialAccountsLoading)
  const facebookAccounts = useAppSelector(selectSocialAccountsByPlatform('facebook'))
  const instagramAccounts = useAppSelector(selectSocialAccountsByPlatform('instagram'))
  const tiktokAccounts = useAppSelector(selectSocialAccountsByPlatform('tiktok'))

  const handleConnect = (platform: Platform) => {
    void dispatch(initOAuthConnection(platform))
  }

  const handleDisconnect = (id: string) => {
    void dispatch(disconnectSocialAccount(id))
  }

  return {
    accounts,
    loading,
    facebookAccounts,
    instagramAccounts,
    tiktokAccounts,
    handleConnect,
    handleDisconnect,
  }
}
