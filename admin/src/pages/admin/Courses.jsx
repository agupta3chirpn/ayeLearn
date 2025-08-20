import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  Search, 
  ArrowUpDown,
  MoreVertical,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Filter,
  Calendar,
  Clock,
  Users,
  Target,
  Award,
  Building,
  ArrowRight
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { API_CONFIG } from '../../config/api'
import ConfirmPopup from '../../components/shared/ConfirmPopup'

const Courses = () => {
  const { logout, user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredCourses, setFilteredCourses] = useState([])
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [deletingCourseId, setDeletingCourseId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)



  // Fetch courses data from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(API_CONFIG.ENDPOINTS.COURSES)
        
        if (response.data.success) {
          setCourses(response.data.data)
        } else {
          console.error('Courses API error:', response.data.message)
        }
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user])

  const getLevelColor = (level) => {
    switch (level) {
      case 'Advanced': return 'bg-red-100 text-red-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Beginner': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter and sort courses
  useEffect(() => {
    let filtered = courses.filter(course => 
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort courses
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || ''
      let bValue = b[sortBy] || ''
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCourses(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [courses, searchTerm, sortBy, sortOrder])

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleDeleteCourse = async (courseId) => {
    const course = courses.find(c => c.id === courseId)
    setCourseToDelete(course)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return
    
    setDeletingCourseId(courseToDelete.id)
    
    try {
      const response = await axios.delete(`${API_CONFIG.ENDPOINTS.COURSES}/${courseToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      
      if (response.data.success) {
        // Remove the course from the list
        setCourses(prev => prev.filter(course => course.id !== courseToDelete.id))
        
        // Show detailed success message
        const details = response.data.details
        const successMessage = `Course "${details.courseTitle}" deleted successfully!\n\nDeleted:\n• ${details.deletedLearners} learner assignments\n• ${details.deletedFiles} file records\n• ${details.deletedModules} module records\n• ${details.deletedFilesFromFS} files from storage`
        
        alert(successMessage)
      } else {
        alert('Failed to delete course: ' + response.data.message)
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred'
      alert(`Failed to delete course: ${errorMessage}`)
    } finally {
      setDeletingCourseId(null)
      setShowDeleteConfirm(false)
      setCourseToDelete(null)
    }
  }

  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-6">
        {/* Breadcrumbs and Add Button */}
        <div className="mb-6 flex justify-between items-center">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">Courses</span>
                </div>
              </li>
            </ol>
          </nav>
          <Link to="/courses/add">
            <button className="px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }} onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'} onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)'}>
              + Add Course
            </button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by title, department, or level..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
                />
              </div>
              
              {/* Sort */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="created_at">Date Added</option>
                  <option value="title">Title</option>
                  <option value="department">Department</option>
                  <option value="level">Level</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredCourses.length} of {courses.length} courses
              </span>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Courses ({courses.length})</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading courses...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {searchTerm ? 'No courses found matching your search.' : 'No courses found.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-purple-600 hover:text-purple-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={deletingCourseId === course.id}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete course"
                      >
                        {deletingCourseId === course.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <Link 
                        to={`/edit-course/${course.id}`}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Edit course"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      {course.department}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.duration || 'Duration not set'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {course.assigned_learners_count || 0} learners
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Link 
                        to={`/course/${course.id}`}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
                      >
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredCourses.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredCourses.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Delete Confirmation Popup */}
      <ConfirmPopup
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setCourseToDelete(null)
        }}
        onConfirm={confirmDeleteCourse}
        title="Confirm Course Deletion"
        message={`Are you sure you want to delete "${courseToDelete?.title}"?\n\nThis will permanently remove:\n• All course data\n• All uploaded files\n• All module information\n• All learner assignments\n\nThis action cannot be undone.`}
        type="confirm"
        confirmText="Delete Course"
        cancelText="Cancel"
      />
    </AdminLayout>
  )
}

export default Courses
