import { startAppListening } from '@/config/create-app-listener-middleware'
import { uploadMedia } from '../usecases/uploadMedia.usecase'
import { deleteMedia } from '../usecases/deleteMedia.usecase'
import { listMedia } from '../usecases/listMedia.usecase'
import { selectMediaMeta } from '../slices/mediaSelectors'

export function registerMediaListeners() {
  // After a successful upload, refresh the list from the server to get the authoritative state
  startAppListening({
    actionCreator: uploadMedia.fulfilled,
    effect: (_action, listenerApi) => {
      const { page, limit } = selectMediaMeta(listenerApi.getState())
      listenerApi.dispatch(listMedia({ page, limit }))
    },
  })

  // After delete, if the current page becomes empty, go back one page
  startAppListening({
    actionCreator: deleteMedia.fulfilled,
    effect: (_action, listenerApi) => {
      const { page, limit, total } = selectMediaMeta(listenerApi.getState())
      const newPage = total === 0 && page > 1 ? page - 1 : page
      listenerApi.dispatch(listMedia({ page: newPage, limit }))
    },
  })
}
