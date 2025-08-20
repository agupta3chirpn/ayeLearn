import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  Users, 
  HelpCircle, 
  FileText, 
  Settings, 
  ChevronDown,
  User
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isLearner, setIsLearner] = useState(false)
  const [learner, setLearner] = useState(null)

  useEffect(() => {
    // Check if user is a learner
    const learnerToken = localStorage.getItem('learnerToken')
    const learnerData = localStorage.getItem('learnerData')
    
    if (learnerToken && learnerData) {
      try {
        const parsedData = JSON.parse(learnerData)
        setLearner(parsedData)
        setIsLearner(true)
      } catch (error) {
        console.error('Error parsing learner data:', error)
      }
    }
  }, [])

  const isActive = (path) => {
    return location.pathname === path
  }

  const isActivePath = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      {/* Navigation Menu */}
      <nav className="px-4 py-6">
        <div className="space-y-2">
          {/* Main Menu Items */}
          {isLearner ? (
            // Learner Navigation
            <>
              <Link 
                to="/learner/dashboard" 
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/learner/dashboard') 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                }`}
                style={isActive('/learner/dashboard') ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <Link 
                to="/learner/courses" 
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath('/learner/courses') 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                }`}
                style={isActivePath('/learner/courses') ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                <span>My Courses</span>
              </Link>
              
              <Link 
                to="/learner/profile" 
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath('/learner/profile') 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                }`}
                style={isActivePath('/learner/profile') ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
              >
                <User className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            // Admin Navigation
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/dashboard') 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                }`}
                style={isActive('/dashboard') ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <Search className="w-5 h-5 mr-3" />
                <span>Search</span>
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <TrendingUp className="w-5 h-5 mr-3" />
                <span>Statistics</span>
              </a>
              
              <Link 
                to="/courses" 
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath('/courses') 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                }`}
                style={isActivePath('/courses') ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                <span>Courses</span>
              </Link>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <GraduationCap className="w-5 h-5 mr-3" />
                <span>Aye Assess</span>
              </a>
              
              <Link 
                to="/learners" 
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath('/learners') 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                }`}
                style={isActivePath('/learners') ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Learners</span>
              </Link>
            </>
          )}
        </div>

        {/* Bottom Menu Items */}
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-2">
          {!isLearner && (
            <>
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <HelpCircle className="w-5 h-5 mr-3" />
                <span>Help</span>
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <FileText className="w-5 h-5 mr-3" />
                <span>Report</span>
              </a>
            </>
          )}
          
          {!isLearner && (
            <div className="space-y-1">
              <button 
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath('/departments') || isActivePath('/experience-levels')
                    ? 'text-white'
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                }`}
                style={(isActivePath('/departments') || isActivePath('/experience-levels')) ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
              >
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {settingsOpen && (
                <div className="ml-8 space-y-1">
                  <Link 
                    to="/departments" 
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActivePath('/departments') 
                        ? 'text-white' 
                        : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                    }`}
                    style={isActivePath('/departments') ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Departments</span>
                  </Link>
                  
                  <Link 
                    to="/experience-levels" 
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActivePath('/experience-levels') 
                        ? 'text-white' 
                        : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]'
                    }`}
                    style={isActivePath('/experience-levels') ? { background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' } : {}}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Experience Levels</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
