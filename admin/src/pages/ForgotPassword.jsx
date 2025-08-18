import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import Logo from '../components/Logo'
import loginImage from '../../assets/login-image.jpg'
import { API_CONFIG } from '../config/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Password reset link has been sent to your email.')
        setEmail('')
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }

    setLoading(false)
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

      {/* Right Side - Forgot Password Form */}
      <div className="flex flex-col justify-center px-6 md:px-8 xl:px-12 w-[600px] h-[668px] shadow-custom-shadow rounded-[24px]">
        <div className="w-full max-w-xl px-4">
          {/* Forgot Password Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo width={144} height={120} className="mx-auto mb-4" />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email*
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
