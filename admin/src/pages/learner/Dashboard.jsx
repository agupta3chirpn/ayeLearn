import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import { API_CONFIG } from '../../config/api'
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
        
        // Update browser tab title
        document.title = `Learner Dashboard | ayeLearn`
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
        const summary = coursesResponse.data.summary
        
        // Sort courses by priority: in progress first, then by assignment date
        const sortedCourses = courses.sort((a, b) => {
          if (a.status === 'in_progress' && b.status !== 'in_progress') return -1
          if (b.status === 'in_progress' && a.status !== 'in_progress') return 1
          return new Date(b.assigned_at) - new Date(a.assigned_at)
        })
        
        setRecentCourses(sortedCourses.slice(0, 6)) // Get latest 6 courses
        
        // Calculate enhanced stats
        setStats({
          totalCourses: summary.total_courses,
          completedCourses: summary.completed_courses,
          inProgressCourses: summary.in_progress_courses,
          averageScore: courses.length > 0 
            ? Math.round(courses.reduce((sum, course) => sum + (course.score || 0), 0) / courses.length)
            : 0,
          averageProgress: summary.average_progress,
          totalModules: summary.total_modules,
          totalFiles: summary.total_files
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
        {/* Assigned Courses Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Assigned Courses</h2>
            <Link to="/learner/courses" className="text-purple-600 hover:text-purple-700 font-medium">
              View All Courses &gt;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    {/* Course Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'completed' ? 'bg-green-100 text-green-800' :
                        course.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status === 'completed' ? 'Completed' :
                         course.status === 'in_progress' ? 'In Progress' :
                         'Not Started'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.completed_modules || 0}/{course.total_modules || 0}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title || 'Untitled Course'}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{course.department || 'General'}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{course.level || 'Beginner'}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {course.total_modules || 0} modules • {course.total_files || 0} files
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.course_type || 'Course'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Complete by {course.due_date ? new Date(course.due_date).toLocaleDateString() : 'No due date'}
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs font-medium text-gray-700">{course.progress_percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${course.progress_percentage || 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration || '4 weeks'}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/learner/courses/${course.id}`}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        {course.status === 'completed' ? 'View Details' : 'Continue Course'} &gt;
                      </Link>
                    </div>
                  </div>
                  
                  {/* Course Stats */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Files: {course.total_files || 0}</span>
                      <span>Modules: {course.total_modules || 0}</span>
                      {course.certificate_available && (
                        <span className="text-green-600">✓ Certificate</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Score Display */}
                  {course.score && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Score:</span>
                        <span className="text-sm font-medium text-green-600">{course.score}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses assigned yet</h3>
                <p className="text-gray-600 mb-4">Contact your administrator to get started with your learning journey.</p>
                <Link
                  to="/learner/courses"
                  className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Available Courses
                </Link>
              </div>
            )}
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
