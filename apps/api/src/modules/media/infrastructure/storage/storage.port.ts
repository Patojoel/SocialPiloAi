export interface StoragePort {
  upload(file: Express.Multer.File, workspaceId: string): Promise<{ url: string; filename: string }>
  delete(filename: string): Promise<void>
}

export const STORAGE_PORT = Symbol('StoragePort')
