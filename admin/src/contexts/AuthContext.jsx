import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_CONFIG } from '../config/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.ADMIN_LOGIN, {
        email,
        password
      })

      const { token, admin } = response.data
      
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminUser', JSON.stringify(admin))
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(admin)
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/api/admin/forgot-password`, { email })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email'
      }
    }
  }

  const resetPassword = async (token, password) => {
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/api/admin/reset-password/${token}`, { password })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    forgotPassword,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
