import type { User } from '../../models/Auth'

export type UpdateProfileCommand = Partial<Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>>
