import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp,
  Calendar,
  User,
  Phone,
  Building,
  GraduationCap,
  LogOut
} from 'lucide-react'
import LearnerLayout from '../../components/learner/LearnerLayout'
import axios from 'axios'
import ConfirmPopup from '../../components/shared/ConfirmPopup'

const LearnerDashboard = () => {
  const [learner, setLearner] = useState(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageScore: 0
  })
  const [recentCourses, setRecentCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const learnerData = localStorage.getItem('learnerData')
    
    if (learnerData) {
      try {
        const parsedData = JSON.parse(learnerData)
        setLearner(parsedData)
        fetchDashboardData(parsedData.id)
      } catch (error) {
        console.error('Error parsing learner data:', error)
        navigate('/learner/login')
      }
    }
  }, [navigate])

  const fetchDashboardData = async (learnerId) => {
    try {
      // Set up axios headers for learner authentication
      const token = localStorage.getItem('learnerToken')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Fetch learner's courses and stats
      const coursesResponse = await axios.get(`${API_CONFIG.ENDPOINTS.LEARNER_COURSES}/${learnerId}/courses`)
      
      if (coursesResponse.data.success) {
        const courses = coursesResponse.data.data
        setRecentCourses(courses.slice(0, 5)) // Get latest 5 courses
        
        // Calculate stats
        setStats({
          totalCourses: courses.length,
          completedCourses: courses.filter(course => course.status === 'completed').length,
          inProgressCourses: courses.filter(course => course.status === 'in_progress').length,
          averageScore: courses.length > 0 
            ? Math.round(courses.reduce((sum, course) => sum + (course.score || 0), 0) / courses.length)
            : 0
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('learnerToken')
    localStorage.removeItem('learnerData')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    delete axios.defaults.headers.common['Authorization']
    navigate('/learner/login')
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = () => {
    handleLogout()
    setShowLogoutConfirm(false)
  }

  if (loading) {
    return (
      <LearnerLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </LearnerLayout>
    )
  }

  return (
    <LearnerLayout>
      <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {learner?.firstName}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your learning journey today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inProgressCourses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {learner?.firstName} {learner?.lastName}
                    </h3>
                    <p className="text-gray-600">{learner?.email}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{learner?.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{learner?.department}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{learner?.experienceLevel}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">
                        Member since {new Date(learner?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Courses */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Courses</h3>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      View All
                    </button>
                  </div>

                  {recentCourses.length > 0 ? (
                    <div className="space-y-4">
                      {recentCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{course.title}</h4>
                              <p className="text-sm text-gray-600">{course.department} • {course.level}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : course.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {course.status === 'completed' ? 'Completed' : 
                               course.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                            </span>
                            {course.score && (
                              <p className="text-sm text-gray-600 mt-1">{course.score}%</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No courses assigned yet.</p>
                      <p className="text-sm text-gray-500">Contact your administrator to get started.</p>
                    </div>
                  )}
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
        </LearnerLayout>
    )
  }

export default LearnerDashboard
