import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, User } from 'lucide-react'
import Logo from '../Logo'
import ConfirmPopup from '../shared/ConfirmPopup'

const LearnerHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [learner, setLearner] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    const learnerData = localStorage.getItem('learnerData')
    if (learnerData) {
      try {
        const parsedData = JSON.parse(learnerData)
        setLearner(parsedData)
      } catch (error) {
        console.error('Error parsing learner data:', error)
      }
    }
  }, [])

  const getPageTitle = () => {
    if (location.pathname.includes('/learner/dashboard')) return 'Learner Dashboard'
    if (location.pathname.includes('/learner/courses')) return 'My Courses'
    if (location.pathname.includes('/learner/profile')) return 'Profile'
    return 'Learner Portal'
  }

  const handleLogout = () => {
    // Clear all authentication tokens to prevent conflicts
    localStorage.removeItem('learnerToken')
    localStorage.removeItem('learnerData')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/learner/login')
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = () => {
    handleLogout()
    setShowLogoutConfirm(false)
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
                <User className="w-4 h-4 text-gray-400 m-auto" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {learner ? `${learner.firstName} ${learner.lastName}` : 'Learner'}
                </div>
                <div className="text-gray-500">
                  {learner?.email || 'Loading...'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            
            {/* Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link 
                  to="/learner/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </Link>
                <button 
                  onClick={handleLogoutClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logout Confirmation Popup */}
      <ConfirmPopup
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will be redirected to the login page."
        type="confirm"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </header>
  )
}

export default LearnerHeader
