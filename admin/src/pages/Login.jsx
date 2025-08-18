import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Logo from '../components/Logo'
import loginImage from '../../assets/login-image.jpg'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await login(email, password)
    
    if (result.success) {
      setSuccess('Login successful! Redirecting to dashboard...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const handleGoogleLogin = () => {
    // Google login functionality would be implemented here

  }

  return (
    <div className="w-full flex justify-center items-center gap-14 overflow-hidden p-8">
      {/* Left Side - Study Image */}
      <div className="hidden md:flex items-center justify-center max-w-[660px]">
        {/* Study Image - Full Coverage */}
        <div className="">
          <img 
            src={loginImage}
            alt="Young man studying with laptop and books"
            className="w-full h-auto object-cover rounded-[22px] max-h-[90vh]"
            onError={(e) => {
              // Fallback if image doesn't load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          
          {/* Fallback CSS illustration if image doesn't load */}
          <div className="hidden w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 relative">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative w-full h-full max-w-2xl max-h-2xl">
                {/* Young Man - Centered */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative">
                    {/* Head */}
                    <div className="w-20 h-20 bg-gray-800 rounded-full relative">
                      {/* Hair */}
                      <div className="absolute top-0 left-0 w-full h-8 bg-gray-900 rounded-t-full"></div>
                      {/* Beard/Stubble */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-14 h-4 bg-gray-700 rounded-full"></div>
                    </div>
                    
                    {/* Body - Maroon shirt over white t-shirt */}
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                      <div className="w-24 h-28 bg-red-800 rounded-t-2xl relative">
                        {/* White t-shirt collar */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-5 bg-white rounded-t-lg"></div>
                      </div>
                    </div>
                    
                    {/* Headphones */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-24 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                        <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Arms */}
                    <div className="absolute top-20 left-3 w-4 h-10 bg-gray-800 rounded-full transform rotate-12"></div>
                    <div className="absolute top-20 right-3 w-4 h-10 bg-gray-800 rounded-full transform -rotate-12"></div>
                  </div>
                </div>
                
                {/* Desk - Full Width */}
                <div className="absolute bottom-32 left-0 right-0 h-6 bg-gray-800 rounded-lg"></div>
                
                {/* Laptop - Centered on Desk */}
                <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2">
                  <div className="w-40 h-24 bg-gray-300 rounded-lg relative">
                    {/* Screen */}
                    <div className="w-36 h-20 bg-blue-900 rounded-sm mx-auto mt-2 relative">
                      {/* Screen content */}
                      <div className="w-32 h-16 bg-blue-700 rounded-sm mx-auto mt-2"></div>
                    </div>
                    {/* Keyboard area */}
                    <div className="w-36 h-3 bg-gray-400 rounded-sm mx-auto mt-1"></div>
                  </div>
                </div>
                
                {/* Books Stack - Right Side */}
                <div className="absolute bottom-36 right-12">
                  <div className="space-y-1">
                    <div className="w-10 h-14 bg-red-500 rounded-sm"></div>
                    <div className="w-10 h-14 bg-green-500 rounded-sm"></div>
                    <div className="w-10 h-14 bg-blue-500 rounded-sm"></div>
                    <div className="w-10 h-14 bg-orange-500 rounded-sm"></div>
                    <div className="w-10 h-14 bg-yellow-600 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Desk Lamp - Left Side */}
                <div className="absolute bottom-44 left-12">
                  <div className="relative">
                    {/* Lamp base */}
                    <div className="w-6 h-10 bg-black rounded-full"></div>
                    {/* Lamp arm */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-black transform rotate-12 origin-bottom"></div>
                    {/* Lamp shade */}
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-black rounded-t-full"></div>
                    {/* Light effect */}
                    <div className="absolute top-18 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-yellow-200 rounded-full opacity-30"></div>
                  </div>
                </div>
                
                {/* Pen Holder */}
                <div className="absolute bottom-36 left-20">
                  <div className="w-8 h-10 bg-black rounded-full relative">
                    {/* Pens */}
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-blue-600"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-red-600 ml-1"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-green-600 ml-2"></div>
                  </div>
                </div>
                
                {/* Bookshelf Background - Full Width */}
                <div className="absolute top-8 left-0 right-0 h-40 bg-amber-100 rounded-lg opacity-60">
                  <div className="grid grid-cols-8 gap-2 p-6">
                    <div className="w-5 h-10 bg-red-400 rounded-sm"></div>
                    <div className="w-5 h-10 bg-blue-400 rounded-sm"></div>
                    <div className="w-5 h-10 bg-green-400 rounded-sm"></div>
                    <div className="w-5 h-10 bg-yellow-400 rounded-sm"></div>
                    <div className="w-5 h-10 bg-purple-400 rounded-sm"></div>
                    <div className="w-5 h-10 bg-pink-400 rounded-sm"></div>
                    <div className="w-5 h-10 bg-indigo-400 rounded-sm"></div>
                    <div className="w-5 h-10 bg-orange-400 rounded-sm"></div>
                  </div>
                  {/* Plant */}
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-green-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center px-6 md:px-8 xl:px-12 w-[600px] h-[668px] shadow-custom-shadow rounded-[24px]">
        <div className="w-full max-w-xl px-4">
          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo width={144} height={120} className="mx-auto mb-4" />
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password*
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : success ? (
                  'Login Successful!'
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Google Login Button - Same style as main login button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading || success}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center mr-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-blue-600 text-xs font-bold mr-1">G</div>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-600 text-xs font-bold mr-1">o</div>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-yellow-600 text-xs font-bold mr-1">o</div>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-blue-600 text-xs font-bold mr-1">g</div>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-green-600 text-xs font-bold mr-1">l</div>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-600 text-xs font-bold">e</div>
              </div>
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
