import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sparkles, Zap, Shield, Globe } from 'lucide-react'
import { useRegister } from '../hooks/useRegister'
import { useAppSelector } from '@/config/hooks'
import { selectIsAuthenticated } from '@/features/auth/slices/authSelectors'
import { AuthRoutes } from '@/routes/routes'
import { Button } from '@/shared/ui/components/ui/button'
import { Input } from '@/shared/ui/components/ui/input'
import { Label } from '@/shared/ui/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/components/ui/card'

const benefits = [
  { icon: Sparkles, title: 'AI Content Generation', description: 'Create engaging posts instantly with OpenRouter AI' },
  { icon: Zap, title: 'Smart Scheduling', description: 'Auto-publish at optimal times for maximum reach' },
  { icon: Globe, title: 'Multi-Platform', description: 'Manage Facebook, Instagram & TikTok in one place' },
  { icon: Shield, title: 'Secure & Reliable', description: 'Enterprise-grade security with 99.9% uptime' },
]

const RegisterPage = () => {
  const { form, handleSubmit, error, isPending } = useRegister()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.15),_transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">SocialPilot AI</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Start growing your
            <br />
            <span className="text-indigo-400">social presence today</span>
          </h1>
          <p className="text-slate-400 text-lg mb-12">
            Join thousands of creators and businesses automating their social media with AI.
          </p>
          <div className="space-y-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{title}</div>
                  <div className="text-slate-400 text-sm">{description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-slate-500 text-sm">© 2026 SocialPilot AI. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">SocialPilot AI</span>
          </div>

          <Card className="shadow-lg border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>Start managing your social media with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      placeholder="John"
                      className={errors.firstName ? 'border-red-400 focus-visible:ring-red-400' : ''}
                    />
                    {errors.firstName && <p className="text-xs text-red-600">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      placeholder="Doe"
                      className={errors.lastName ? 'border-red-400 focus-visible:ring-red-400' : ''}
                    />
                    {errors.lastName && <p className="text-xs text-red-600">{errors.lastName.message}</p>}
                  </div>
                </div>

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
                  <Label htmlFor="password">Password</Label>
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

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={errors.confirmPassword ? 'border-red-400 focus-visible:ring-red-400 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  {isPending ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500 pt-2">
                Already have an account?{' '}
                <Link to={AuthRoutes.LOGIN} className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
