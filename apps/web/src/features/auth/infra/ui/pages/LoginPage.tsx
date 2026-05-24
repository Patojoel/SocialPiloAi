import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'
import { useLogin } from '../hooks/useLogin'
import { useAppSelector } from '@/config/hooks'
import { selectIsAuthenticated } from '@/features/auth/slices/authSelectors'
import { AuthRoutes } from '@/routes/routes'
import { Button } from '@/shared/ui/components/ui/button'
import { Input } from '@/shared/ui/components/ui/input'
import { Label } from '@/shared/ui/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/components/ui/card'

const stats = [
  { icon: Users, label: 'Active Users', value: '50K+' },
  { icon: TrendingUp, label: 'Engagement Rate', value: '8.4%' },
  { icon: BarChart3, label: 'Posts Scheduled', value: '2.5M' },
  { icon: Calendar, label: 'Analytics Reports', value: '100K+' },
]

const LoginPage = () => {
  const { form, handleSubmit, error, isPending } = useLogin()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),_transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">SocialPilot AI</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Manage your social media
            <br />
            <span className="text-indigo-400">with intelligence</span>
          </h1>
          <p className="text-slate-400 text-lg mb-12">
            AI-powered scheduling, content generation, and analytics for Facebook, Instagram &amp; TikTok.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Icon className="w-5 h-5 text-indigo-400 mb-2" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-slate-500 text-sm">© 2026 SocialPilot AI. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">SocialPilot AI</span>
          </div>

          <Card className="shadow-lg border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to={AuthRoutes.FORGOT_PASSWORD}
                      className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={errors.password ? 'border-red-400 focus-visible:ring-red-400 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                </div>

                <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  {isPending ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500 pt-2">
                Don&apos;t have an account?{' '}
                <Link to={AuthRoutes.REGISTER} className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
