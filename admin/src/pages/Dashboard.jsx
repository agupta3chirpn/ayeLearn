import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { 
  MoreVertical,
  ArrowUpDown
} from 'lucide-react'
import axios from 'axios'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { API_CONFIG } from '../config/api'

const Dashboard = () => {
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [platformInsights, setPlatformInsights] = useState([])
  const [recentCourses, setRecentCourses] = useState([])
  const [learners, setLearners] = useState([])
  const [filteredLearners, setFilteredLearners] = useState([])
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedLearners, setSelectedLearners] = useState([])

  const [sortBy, setSortBy] = useState('name')



  // Fetch all dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) return

        const headers = {
          'Authorization': `Bearer ${token}`
        }

        // Fetch profile data
        const profileResponse = await axios.get(API_CONFIG.ENDPOINTS.ADMIN_PROFILE, { headers })
        
        if (profileResponse.data.success) {
          setProfile(profileResponse.data.profile)
        }

        // Fetch platform insights (dashboard statistics)
        const insightsResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/dashboard-stats`, { headers })
        
        if (insightsResponse.data.success) {
          const stats = insightsResponse.data.stats
          setPlatformInsights([
            { title: 'Active Learners', value: stats.activeLearners || '0', trend: stats.learnerGrowth || '+0%', color: 'green' },
            { title: 'Courses Published', value: stats.totalCourses || '0', trend: stats.courseGrowth || '+0', color: 'green' },
            { title: 'Assessments Completed', value: stats.completedAssessments || '0', trend: stats.assessmentRate || '0%', color: 'orange' },
            { title: 'Avg Assessment Score', value: stats.avgScore || '0%', trend: stats.scoreGrowth || '+0%', color: 'green' },
            { title: 'Reports Exported', value: stats.reportsExported || '0', trend: stats.reportGrowth || '+0', color: 'blue' }
          ])
        }

        // Fetch recent courses
        const coursesResponse = await axios.get(`${API_CONFIG.ENDPOINTS.COURSES}?limit=4`, { headers })
        
        if (coursesResponse.data.success) {
          setRecentCourses(coursesResponse.data.data.map(course => ({
            id: course.id,
            title: course.title,
            category: `${course.department} • ${course.level}`,
            createdOn: new Date(course.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            assignedLearners: course.assigned_learners_count || '0'
          })))
        }

        // Fetch learners (last 5 records)
        const learnersResponse = await axios.get(`${API_CONFIG.ENDPOINTS.LEARNERS}?limit=5&sort=created_at&order=desc`, { headers })
        
        if (learnersResponse.data.success) {
          const learnersData = learnersResponse.data.data.map(learner => ({
            id: learner.id,
            name: `${learner.first_name} ${learner.last_name}`,
            email: learner.email,
            experience: learner.experience_level || 'Beginner',
            department: learner.department || 'General'
          }))
          setLearners(learnersData)
          setFilteredLearners(learnersData)
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Set default data if API fails
        setPlatformInsights([
          { title: 'Active Learners', value: '0', trend: '+0%', color: 'green' },
          { title: 'Courses Published', value: '0', trend: '+0', color: 'green' },
          { title: 'Assessments Completed', value: '0', trend: '0%', color: 'orange' },
          { title: 'Avg Assessment Score', value: '0%', trend: '+0%', color: 'green' },
          { title: 'Reports Exported', value: '0', trend: '+0', color: 'blue' }
        ])
        setRecentCourses([])
        setLearners([])
        setFilteredLearners([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Filter learners based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLearners(learners)
    } else {
      const filtered = learners.filter(learner =>
        learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.experience.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredLearners(filtered)
    }
  }, [searchTerm, learners])

  const getTrendColor = (color) => {
    switch (color) {
      case 'green': return 'text-green-600'
      case 'orange': return 'text-orange-600'
      case 'red': return 'text-red-600'
      case 'blue': return 'text-blue-600'
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

  const handleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc'
    setSortOrder(newOrder)
    setSortBy('name')
    
    const sorted = [...filteredLearners].sort((a, b) => {
      if (newOrder === 'asc') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
    setFilteredLearners(sorted)
  }

  const handleSortByColumn = (column) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newOrder)
    setSortBy(column)
    
    const sorted = [...filteredLearners].sort((a, b) => {
      let aValue = a[column] || ''
      let bValue = b[column] || ''
      
      if (newOrder === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })
    setFilteredLearners(sorted)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLearners(filteredLearners.map(learner => learner.id))
    } else {
      setSelectedLearners([])
    }
  }

  const handleSelectLearner = (learnerId, checked) => {
    if (checked) {
      setSelectedLearners(prev => [...prev, learnerId])
    } else {
      setSelectedLearners(prev => prev.filter(id => id !== learnerId))
    }
  }



  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
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
                <Link to="/dashboard/stats" className="text-purple-600 hover:text-purple-700 font-medium">View All &gt;</Link>
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
                <Link to="/courses" className="text-purple-600 hover:text-purple-700 font-medium">View All &gt;</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentCourses.length > 0 ? (
                  recentCourses.map((course, index) => (
                    <div key={course.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                          <p className="text-sm text-gray-500">Created on {course.createdOn}</p>
                        </div>

                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Assigned Learners: <span className="font-medium">{course.assignedLearners}</span>
                        </span>
                        <Link to={`/course/${course.id}`} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          View Course &gt;
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No courses found. Create your first course!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Learners Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Learners (Last 5)</h3>
                  
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
                    
                    {/* Sort */}
                    <button 
                      onClick={() => handleSort()}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Sort
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedLearners.length === filteredLearners.length && filteredLearners.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name & Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSortByColumn('experience')}
                          className="flex items-center hover:text-gray-700"
                        >
                          Experience Level
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSortByColumn('department')}
                          className="flex items-center hover:text-gray-700"
                        >
                          Department
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLearners.length > 0 ? (
                      filteredLearners.map((learner, index) => (
                        <tr key={learner.id || index} className="hover:bg-gray-50">
                                                  <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={selectedLearners.includes(learner.id)}
                            onChange={(e) => handleSelectLearner(learner.id, e.target.checked)}
                          />
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
                                : learner.experience === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {learner.experience}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {learner.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/learners/edit/${learner.id}`}>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          {searchTerm ? 'No learners found matching your search.' : 'Showing last 5 learners. No learners found. Add your first learner!'}
                        </td>
                      </tr>
                    )}
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
