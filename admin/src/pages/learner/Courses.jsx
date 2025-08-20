import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  BookOpen, 
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  TrendingUp
} from 'lucide-react'
import LearnerLayout from '../../components/learner/LearnerLayout'
import axios from 'axios'
import { API_CONFIG } from '../../config/api'

const LearnerCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('learnerToken')
      const learnerData = localStorage.getItem('learnerData')
      
      if (!token || !learnerData) {
        navigate('/learner/login')
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const parsedData = JSON.parse(learnerData)

      const response = await axios.get(`${API_CONFIG.ENDPOINTS.LEARNER_COURSES}/${parsedData.id}/courses`)
      
      if (response.data.success) {
        const coursesData = response.data.data
        const summary = response.data.summary
        
        // Sort courses by priority: in progress first, then by assignment date
        const sortedCourses = coursesData.sort((a, b) => {
          if (a.status === 'in_progress' && b.status !== 'in_progress') return -1
          if (b.status === 'in_progress' && a.status !== 'in_progress') return 1
          return new Date(b.assigned_at) - new Date(a.assigned_at)
        })
        
        setCourses(sortedCourses)
        
        // Extract unique departments
        const uniqueDepartments = [...new Set(sortedCourses.map(course => course.department).filter(Boolean))]
        setDepartments(uniqueDepartments)
        
        // Log summary for debugging
        console.log('Course Summary:', summary)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.department?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    const matchesDepartment = filterDepartment === 'all' || course.department === filterDepartment
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in_progress': return 'In Progress'
      default: return 'Not Started'
    }
  }

  if (loading) {
    return (
      <LearnerLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading courses...</span>
          </div>
        </div>
      </LearnerLayout>
    )
  }

  return (
    <LearnerLayout>
      <div className="p-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/learner/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Assigned Courses</h1>
                <p className="text-gray-600 mt-1">View all your assigned courses and track your learning progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {courses.length} course{courses.length !== 1 ? 's' : ''} assigned
              </span>
            </div>
          </div>

                     {/* Course Summary Stats */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             <div className="bg-white rounded-lg shadow-sm border p-4">
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                   <BookOpen className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-600">Total Courses</p>
                   <p className="text-xl font-bold text-gray-900">{courses.length}</p>
                 </div>
               </div>
             </div>
             
             <div className="bg-white rounded-lg shadow-sm border p-4">
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                   <CheckCircle className="w-5 h-5 text-green-600" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-600">Completed</p>
                   <p className="text-xl font-bold text-gray-900">
                     {courses.filter(c => c.status === 'completed').length}
                   </p>
                 </div>
               </div>
             </div>
             
             <div className="bg-white rounded-lg shadow-sm border p-4">
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                   <Clock className="w-5 h-5 text-orange-600" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-600">In Progress</p>
                   <p className="text-xl font-bold text-gray-900">
                     {courses.filter(c => c.status === 'in_progress').length}
                   </p>
                 </div>
               </div>
             </div>
             
             <div className="bg-white rounded-lg shadow-sm border p-4">
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                   <TrendingUp className="w-5 h-5 text-purple-600" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                   <p className="text-xl font-bold text-gray-900">
                     {courses.length > 0 ? 
                       Math.round(courses.reduce((sum, c) => sum + (c.progress_percentage || 0), 0) / courses.length) : 0}%
                   </p>
                 </div>
               </div>
             </div>
           </div>

           {/* Search and Filters */}
           <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses by title or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

                           {/* Courses Grid */}
                 {filteredCourses.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {filteredCourses.map((course) => (
                       <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                         <div className="mb-4">
                           {/* Course Status and Progress */}
                           <div className="flex items-center justify-between mb-3">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                               {getStatusText(course.status)}
                             </span>
                             <span className="text-xs text-gray-500">
                               {course.completed_modules || 0}/{course.total_modules || 0} modules
                             </span>
                           </div>
                           
                           {/* Course Title */}
                           <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                             {course.title || 'Untitled Course'}
                           </h3>
                           
                                                       {/* Course Metadata */}
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
                           
                           {/* Due Date */}
                           <div className="flex items-center text-sm text-gray-500 mb-3">
                             <Calendar className="w-4 h-4 mr-1" />
                             {course.due_date ? new Date(course.due_date).toLocaleDateString() : 'No due date'}
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
                         </div>
                         
                         {/* Course Actions */}
                         <div className="flex items-center justify-between">
                           <div className="flex items-center text-sm text-gray-600">
                             <Clock className="w-4 h-4 mr-1" />
                             {course.duration || '1 week'}
                           </div>
                           <Link
                             to={`/learner/courses/${course.id}`}
                             className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                           >
                             {course.status === 'completed' ? 'View Details' : 'Continue Course'} &gt;
                           </Link>
                         </div>
                         
                         {/* Score Display */}
                         {course.score && (
                           <div className="mt-3 pt-3 border-t border-gray-100">
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-gray-600">Final Score:</span>
                               <span className="text-sm font-medium text-green-600">{course.score}%</span>
                             </div>
                           </div>
                         )}
                         
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
                          
                          {/* Course Description Preview */}
                          {course.overview && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {course.overview.substring(0, 100)}...
                              </p>
                            </div>
                          )}
                       </div>
                     ))}
                   </div>
                           ) : (
                   <div className="text-center py-12">
                     <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                     <h3 className="text-lg font-medium text-gray-900 mb-2">
                       {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all' 
                         ? 'No courses found' 
                         : 'No courses assigned yet'}
                     </h3>
                     <p className="text-gray-600 mb-4">
                       {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all'
                         ? 'Try adjusting your search terms or filters.'
                         : 'Contact your administrator to get started with your learning journey.'}
                     </p>
                     {(searchTerm || filterStatus !== 'all' || filterDepartment !== 'all') ? (
                       <button
                         onClick={() => {
                           setSearchTerm('')
                           setFilterStatus('all')
                           setFilterDepartment('all')
                         }}
                         className="px-4 py-2 text-white rounded-lg font-medium transition-all duration-200"
                         style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }}
                       >
                         Clear Filters
                       </button>
                     ) : (
                       <Link
                         to="/learner/dashboard"
                         className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-200"
                         style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }}
                       >
                         <BookOpen className="w-4 h-4 mr-2" />
                         Back to Dashboard
                       </Link>
                     )}
                   </div>
                 )}
        </div>
      </div>
    </LearnerLayout>
  )
}

export default LearnerCourses
