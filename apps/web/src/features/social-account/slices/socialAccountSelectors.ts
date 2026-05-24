import type { RootState } from '@/config/create-store'
import { socialAccountAdapterSelectors } from './socialAccountSlice'
import type { Platform } from '../models/SocialAccount'

const selectSocialAccountState = (state: RootState) => state.socialAccounts

export const selectAllSocialAccounts = (state: RootState) =>
  socialAccountAdapterSelectors.selectAll(selectSocialAccountState(state))

export const selectSocialAccountsLoading = (state: RootState) => selectSocialAccountState(state).loading

export const selectSocialAccountsError = (state: RootState) => selectSocialAccountState(state).error

export const selectSocialAccountsByPlatform = (platform: Platform) => (state: RootState) =>
  socialAccountAdapterSelectors
    .selectAll(selectSocialAccountState(state))
    .filter((account) => account.platform === platform)
