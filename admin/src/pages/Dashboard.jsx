import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { 
  MoreVertical,
  ArrowUpDown
} from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { API_CONFIG } from '../config/api'

const Dashboard = () => {
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) return

        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN_PROFILE, {
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

  const platformInsights = [
    { title: 'Active Learners', value: '300', trend: '+2.3%', color: 'green' },
    { title: 'Courses Published', value: '27', trend: '+5', color: 'green' },
    { title: 'Assessments Completed', value: '1,285', trend: '70%', color: 'orange' },
    { title: 'Avg Assessment Score', value: '82%', trend: '+12%', color: 'green' },
    { title: 'Reports Exported', value: '39', trend: '-10', color: 'red' }
  ]

  const recentCourses = [
    {
      title: 'Pediatric Care Essentials',
      category: 'Pediatrics • Advanced',
      createdOn: 'May 15, 2025',
      assignedLearners: '236'
    },
    {
      title: 'Basics of Endocrinology',
      category: 'Endocrinology • Beginner',
      createdOn: 'May 12, 2025',
      assignedLearners: '95'
    },
    {
      title: 'Neurology Case Studies',
      category: 'Neurology • Intermediate',
      createdOn: 'May 10, 2025',
      assignedLearners: '80'
    }
  ]

  const learners = [
    { name: 'Drishti Rao', email: 'drishti.rao01@email.com', experience: 'Beginner', department: 'Cardiology' },
    { name: 'Ravi Thakur', email: 'ravi.thakur02@email.com', experience: 'Advanced', department: 'Endocrinology' },
    { name: 'Sneha Iyer', email: 'sneha.iyer03@email.com', experience: 'Beginner', department: 'Cardiology' },
    { name: 'Arjun Mehta', email: 'arjun.mehta04@email.com', experience: 'Advanced', department: 'Pediatrics' }
  ]

  const getTrendColor = (color) => {
    switch (color) {
      case 'green': return 'text-green-600'
      case 'orange': return 'text-orange-600'
      case 'red': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (color) => {
    return (
      <svg className={`w-4 h-4 ${getTrendColor(color)}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
      </svg>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

    return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Header - Full Width */}
      <Header />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Greeting and Action Buttons */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold" style={{ color: '#085EB4' }}>
                  {getGreeting()}, {profile?.first_name || 'Admin'}!
                </h2>
                <div className="flex items-center space-x-4">
                  <Link to="/learners/add">
                    <button className="px-4 py-2 text-white rounded-lg font-medium transition-all duration-200" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }} onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'} onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)'}>
                      Add New Member
                    </button>
                  </Link>
                  <Link to="/courses/add">
                    <button className="px-4 py-2 text-white rounded-lg font-medium transition-all duration-200" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }} onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'} onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)'}>
                      Add New Course
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Platform Insights */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                                 <h3 className="text-xl font-semibold text-gray-900">Platform Insights</h3>
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">View All &gt;</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {platformInsights.map((insight, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                                             <h4 className="text-sm font-medium text-gray-600">{insight.title}</h4>
                      {getTrendIcon(insight.color)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{insight.value}</span>
                      <span className={`text-sm font-medium ${getTrendColor(insight.color)}`}>
                        {insight.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Added Courses */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                                 <h3 className="text-xl font-semibold text-gray-900">Recently Added Courses</h3>
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">View All &gt;</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentCourses.map((course, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                                                 <h4 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                        <p className="text-sm text-gray-500">Created on {course.createdOn}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Assigned Learners: <span className="font-medium">{course.assignedLearners}</span>
                      </span>
                      <a href="#" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        View Course &gt;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learners Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                                     <h3 className="text-xl font-semibold text-gray-900">Learners</h3>
                  
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search learners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Sort and Filter */}
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Sort
                    </button>
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <MoreVertical className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name & Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Experience Level
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Department
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {learners.map((learner, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{learner.name}</div>
                            <div className="text-sm text-gray-500">{learner.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            learner.experience === 'Advanced' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {learner.experience}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {learner.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
