import { startAppListening } from '@/config/create-app-listener-middleware'
import { login } from '../usecases/login/login.usecase'
import { register } from '../usecases/register/register.usecase'
import { fetchMe } from '../usecases/fetchMe/fetchMe.usecase'
import { listWorkspaces } from '@/features/workspace/usecases/listWorkspaces/listWorkspaces.usecase'
import { selectIsAuthenticated, selectAccessToken } from '../slices/authSelectors'
import { logout } from '../usecases/logout/logout.usecase'

export function setupAuthListeners() {
  startAppListening({
    actionCreator: login.fulfilled,
    effect: (_action, listenerApi) => {
      listenerApi.dispatch(fetchMe())
    },
  })

  startAppListening({
    actionCreator: register.fulfilled,
    effect: (_action, listenerApi) => {
      listenerApi.dispatch(fetchMe())
    },
  })

  // Load workspaces after user identity is confirmed (login, register, or page-refresh rehydration)
  startAppListening({
    actionCreator: fetchMe.fulfilled,
    effect: (_action, listenerApi) => {
      listenerApi.dispatch(listWorkspaces())
    },
  })

  // On page refresh: redux-persist rehydrates the store.
  // - If token is present → re-validate session and reload workspaces.
  // - If token is missing but isAuthenticated is true → stale persisted state
  //   (user logged in before accessToken was added to Redux) → force logout.
  startAppListening({
    type: 'persist/REHYDRATE',
    effect: (_action, listenerApi) => {
      const state = listenerApi.getState()
      const isAuthenticated = selectIsAuthenticated(state)
      const token = selectAccessToken(state)

      if (isAuthenticated && token) {
        listenerApi.dispatch(fetchMe())
      } else if (isAuthenticated && !token) {
        listenerApi.dispatch(logout())
      }
    },
  })
}
