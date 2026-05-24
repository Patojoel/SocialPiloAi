import { startAppListening } from '@/config/create-app-listener-middleware'
import { publishNow } from '../usecases/publishNow.usecase'
import { pollPostStatus } from '../usecases/pollPostStatus.usecase'

export function registerPostListeners() {
  startAppListening({
    actionCreator: publishNow.fulfilled,
    effect: (action, { dispatch }) => {
      void dispatch(pollPostStatus(action.payload.id))
    },
  })
}
