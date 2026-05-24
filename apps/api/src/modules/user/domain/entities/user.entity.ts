export interface User {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
