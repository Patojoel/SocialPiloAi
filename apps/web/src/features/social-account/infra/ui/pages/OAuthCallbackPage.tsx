import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle } from 'lucide-react'
import { SocialAccountRoutes } from '../../routes/socialAccountRoutes'

const OAuthCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  useEffect(() => {
    if (error) {
      navigate(SocialAccountRoutes.LIST, { replace: true })
      return
    }
    if (code) {
      // The backend handles the OAuth exchange via redirect — just navigate back
      const timer = setTimeout(() => {
        navigate(SocialAccountRoutes.LIST, { replace: true })
      }, 1500)
      return () => clearTimeout(timer)
    }
    navigate(SocialAccountRoutes.LIST, { replace: true })
    return
  }, [code, error, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-red-400 text-lg font-medium">Connection failed. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            {code ? (
              <CheckCircle className="w-10 h-10 text-white" />
            ) : (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {code ? 'Account Connected!' : 'Connecting your account...'}
          </h2>
          <p className="mt-2 text-slate-400">
            {code ? 'Redirecting you back...' : 'Please wait while we verify your connection.'}
          </p>
        </div>
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default OAuthCallbackPage
