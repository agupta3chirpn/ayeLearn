import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  User
} from 'lucide-react'

const LearnerSidebar = () => {
  const location = useLocation()

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
        </div>
      </nav>
    </div>
  )
}

export default LearnerSidebar
