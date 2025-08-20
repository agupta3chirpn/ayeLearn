import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Logo from '../Logo'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { API_CONFIG } from '../../config/api'
import loginImage from '../../../assets/login-image.jpg'

const SharedLogin = ({ userType = 'admin' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  // Check for existing authentication and redirect if needed
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const learnerToken = localStorage.getItem('learnerToken')
    
    if (userType === 'learner' && adminToken) {
      // If learner is trying to login but admin is already logged in
      setError('Admin is already logged in. Please logout from admin panel first.')
      return
    }
    
    if (userType === 'admin' && learnerToken) {
      // If admin is trying to login but learner is already logged in
      setError('Learner is already logged in. Please logout from learner panel first.')
      return
    }
    
    // If user is already authenticated for the correct type, redirect to dashboard
    if (userType === 'learner' && learnerToken) {
      navigate('/learner/dashboard')
    } else if (userType === 'admin' && adminToken) {
      navigate('/dashboard')
    }
  }, [userType, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user starts typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check for existing authentication before attempting login
    const adminToken = localStorage.getItem('adminToken')
    const learnerToken = localStorage.getItem('learnerToken')
    
    if (userType === 'learner' && adminToken) {
      setError('Admin is already logged in. Please logout from admin panel first.')
      setLoading(false)
      return
    }
    
    if (userType === 'admin' && learnerToken) {
      setError('Learner is already logged in. Please logout from learner panel first.')
      setLoading(false)
      return
    }

    try {
      if (userType === 'learner') {
        // Handle learner login
        const endpoint = API_CONFIG.ENDPOINTS.LEARNER_LOGIN
        const response = await axios.post(endpoint, formData)
        
        if (response.data.success) {
          localStorage.setItem('learnerToken', response.data.token)
          localStorage.setItem('learnerData', JSON.stringify(response.data.data))
          navigate('/learner/dashboard')
        }
      } else {
        // Handle admin login using AuthContext
        const result = await login(formData.email, formData.password)
        
        if (result.success) {
          navigate('/dashboard')
        } else {
          setError(result.message || 'Login failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    return userType === 'learner' ? 'Learner Login' : 'Admin Login'
  }

  const getSubtitle = () => {
    return userType === 'learner' 
      ? 'Access your learning dashboard' 
      : 'Access the admin panel'
  }

  const getForgotPasswordLink = () => {
    return userType === 'learner' ? '/learner/forgot-password' : '/forgot-password'
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

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
              <p className="text-gray-600">{getSubtitle()}</p>
            </div>

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
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password*
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
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
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm">
                <Link
                  to={getForgotPasswordLink()}
                  className="text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors">
                  Need help?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedLogin
