export enum ModalEventKey {
  CREATE_WORKSPACE = 'CREATE_WORKSPACE',
}

type ModalEventHandler = () => void

const handlers: Map<ModalEventKey, Set<ModalEventHandler>> = new Map()

export const ModalEvents = {
  open(key: ModalEventKey): void {
    handlers.get(key)?.forEach((h) => h())
  },
  close(key: ModalEventKey): void {
    handlers.get(key)?.forEach((h) => h())
  },
  on(key: ModalEventKey, handler: ModalEventHandler): () => void {
    if (!handlers.has(key)) handlers.set(key, new Set())
    handlers.get(key)!.add(handler)
    return () => handlers.get(key)?.delete(handler)
  },
}
