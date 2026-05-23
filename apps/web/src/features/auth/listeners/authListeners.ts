import { startAppListening } from '@/config/create-app-listener-middleware'
import { login } from '../usecases/login/login.usecase'
import { register } from '../usecases/register/register.usecase'
import { fetchMe } from '../usecases/fetchMe/fetchMe.usecase'

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
}
