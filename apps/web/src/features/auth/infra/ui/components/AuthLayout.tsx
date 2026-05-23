import { cn } from '@/shared/utils/cn'

interface Props {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export const AuthLayout = ({ children, title, subtitle }: Props) => {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-gray-50 px-4')}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SocialPilot AI</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="bg-white shadow-md rounded-lg p-8">{children}</div>
      </div>
    </div>
  )
}
