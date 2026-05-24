import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, BarChart3, CheckCircle } from 'lucide-react'
import { useForgotPassword } from '../hooks/useForgotPassword'
import { AuthRoutes } from '@/routes/routes'
import { Button } from '@/shared/ui/components/ui/button'
import { Input } from '@/shared/ui/components/ui/input'
import { Label } from '@/shared/ui/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/components/ui/card'

const ForgotPasswordPage = () => {
  const { form, handleSubmit, submitted } = useForgotPassword()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900">SocialPilot AI</span>
        </div>

        {submitted ? (
          <Card className="shadow-lg border-slate-200 text-center">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription className="text-base">
                If that email address is in our system, we&apos;ve sent a password reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={AuthRoutes.LOGIN}>
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Forgot password?</CardTitle>
              <CardDescription className="text-center">
                Enter your email and we&apos;ll send you a reset link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Send reset link
                </Button>
              </form>

              <Link to={AuthRoutes.LOGIN} className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to login
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
