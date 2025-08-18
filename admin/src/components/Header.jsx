import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import { Bell, ChevronDown, User } from 'lucide-react'
import Logo from './Logo'
import { API_CONFIG } from '../config/api'

const Header = () => {
  const { logout } = useAuth()
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) return

        const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        
        if (data.success) {
          setProfile(data.profile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard'
    if (location.pathname.includes('/learners')) return 'Learners'
    if (location.pathname.includes('/courses')) return 'Courses'
    if (location.pathname.includes('/departments')) return 'Departments'
    if (location.pathname.includes('/experience-levels')) return 'Experience Levels'
    if (location.pathname.includes('/profile')) return 'Profile'
    return 'Admin Panel'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Logo and Title */}
        <div className="flex items-center space-x-4">
          <Logo width={80} height={65} />
          <h1 className="text-2xl font-semibold" style={{ color: '#085EB4' }}>
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Profile */}
          <div className="relative group">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                {profile?.profile_image ? (
                  <img 
                    src={`${API_CONFIG.BASE_URL}${profile.profile_image}`}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => console.error('Profile image failed to load:', e.target.src)}
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-400 m-auto" />
                )}
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.email || 'Admin User'
                  }
                </div>
                <div className="text-gray-500">{profile?.email || 'Loading...'}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            
            {/* Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile Settings
                </Link>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
