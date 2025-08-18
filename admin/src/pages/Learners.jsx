import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  Search, 
  ArrowUpDown,
  MoreVertical,
  User,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { API_CONFIG } from '../config/api'

const Learners = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [learners, setLearners] = useState([])
  const [filteredLearners, setFilteredLearners] = useState([])
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedLearners, setSelectedLearners] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [learnerToDelete, setLearnerToDelete] = useState(null)


  // Fetch learners data
  useEffect(() => {
    const fetchLearners = async () => {
      try {
        console.log('🔍 Environment check:')
        console.log('  VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
        console.log('  API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL)
        console.log('🔍 Fetching learners from:', API_CONFIG.ENDPOINTS.LEARNERS)
        const response = await axios.get(API_CONFIG.ENDPOINTS.LEARNERS)
        
        if (response.data.success) {
          console.log('✅ Learners fetched successfully:', response.data.data.length, 'learners')
          console.log('🔍 Sample learner data:', response.data.data[0])
          setLearners(response.data.data)
          setFilteredLearners(response.data.data)
        } else {
          console.error('Learners API error:', response.data.message)
        }
      } catch (error) {
        console.error('Error fetching learners:', error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLearners()
  }, [user])

  // Filter and sort learners
  useEffect(() => {
    let filtered = learners.filter(learner => 
      learner.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort learners
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

    setFilteredLearners(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [learners, searchTerm, sortBy, sortOrder])

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLearners = filteredLearners.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredLearners.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const getExperienceColor = (experience) => {
    switch (experience) {
      case 'Advanced': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Beginner': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Test image URL accessibility
  const testImageUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      console.log(`🔍 Image URL test for ${url}:`, response.status, response.statusText)
      return response.ok
    } catch (error) {
      console.error(`❌ Image URL test failed for ${url}:`, error)
      return false
    }
  }

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.menu-container')) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  // Handle learner deletion
  const handleDeleteLearner = async (learnerId) => {
    setDeleteLoading(learnerId)
    try {
      const response = await axios.delete(`${API_CONFIG.ENDPOINTS.LEARNERS}/${learnerId}`)
      
      if (response.data.success) {
        setLearners(prev => prev.filter(learner => learner.id !== learnerId))
        console.log('✅ Learner deleted successfully')
      } else {
        console.error('Delete API error:', response.data.message)
        alert('Failed to delete learner. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting learner:', error.response?.data || error.message)
      alert('Failed to delete learner. Please try again.')
    } finally {
      setDeleteLoading(null)
      setOpenMenuId(null)
      setShowDeleteModal(false)
      setLearnerToDelete(null)
    }
  }

  // Handle learner status toggle
  const handleToggleStatus = async (learnerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await axios.patch(`${API_CONFIG.ENDPOINTS.LEARNERS}/${learnerId}/status`, {
        status: newStatus
      })
      
      if (response.data.success) {
        setLearners(prev => prev.map(learner => 
          learner.id === learnerId 
            ? { ...learner, status: newStatus }
            : learner
        ))
        console.log('✅ Learner status updated successfully')
      } else {
        console.error('Status update API error:', response.data.message)
        alert('Failed to update learner status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating learner status:', error.response?.data || error.message)
      alert('Failed to update learner status. Please try again.')
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Header */}
      <Header />
      


      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content Area */}
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
                      <span className="text-gray-500">Learners</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <Link to="/learners/add">
                <button className="px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }} onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'} onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)'}>
                  + Add Learner
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
                      placeholder="Search learners by name, email, or department..."
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
                      <option value="first_name">First Name</option>
                      <option value="last_name">Last Name</option>
                      <option value="email">Email</option>
                      <option value="department">Department</option>
                      <option value="experience_level">Experience Level</option>
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
                    {filteredLearners.length} of {learners.length} learners
                  </span>
                </div>
              </div>
            </div>

            {/* Learners List */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Learners ({learners.length})</h2>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading learners...</p>
                </div>
              ) : filteredLearners.length === 0 ? (
                <div className="p-8 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {searchTerm ? 'No learners found matching your search.' : 'No learners found.'}
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
                <div>
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
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentLearners.map((learner, index) => {
                          // Debug image URL construction
                          if (learner.avatar_url) {
                            const fullUrl = `${API_CONFIG.BASE_URL}${learner.avatar_url}`;
                            console.log(`🔍 Learner ${learner.id} (${learner.first_name} ${learner.last_name}):`);
                            console.log(`   avatar_url: ${learner.avatar_url}`);
                            console.log(`   API_CONFIG.BASE_URL: ${API_CONFIG.BASE_URL}`);
                            console.log(`   Full URL: ${fullUrl}`);
                            // Test the image URL
                            testImageUrl(fullUrl);
                          }
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                                  {learner.avatar_url ? (
                                    <img 
                                      src={`${API_CONFIG.BASE_URL}${learner.avatar_url}`} 
                                      alt={`${learner.first_name} ${learner.last_name}`}
                                      className="w-full h-full object-cover"
                                      onLoad={(e) => {
                                        console.log('✅ Image loaded successfully:', e.target.src);
                                      }}
                                      onError={(e) => {
                                        console.error('❌ Image failed to load:', e.target.src);
                                        console.error('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
                                        console.error('learner.avatar_url:', learner.avatar_url);
                                        console.error('Full URL:', `${API_CONFIG.BASE_URL}${learner.avatar_url}`);
                                        console.error('Learner ID:', learner.id);
                                        console.error('Learner Name:', `${learner.first_name} ${learner.last_name}`);
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-full h-full flex items-center justify-center ${learner.avatar_url ? 'hidden' : ''}`}>
                                    <User className="w-5 h-5 text-gray-400" />
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{`${learner.first_name} ${learner.last_name}`}</div>
                                  <div className="text-sm text-gray-500">{learner.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceColor(learner.experience_level)}`}>
                                {learner.experience_level}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {learner.department}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleStatus(learner.id, learner.status)}
                                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(learner.status)} hover:opacity-80 transition-opacity`}
                              >
                                {learner.status === 'active' ? (
                                  <>
                                    <Eye className="w-3 h-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap relative">
                              <button 
                                className="text-gray-400 hover:text-gray-600 menu-container"
                                onClick={() => setOpenMenuId(openMenuId === learner.id ? null : learner.id)}
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              
                              {openMenuId === learner.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 menu-container">
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        navigate(`/learners/edit/${learner.id}`)
                                        setOpenMenuId(null)
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </button>
                                                                         <button
                                       onClick={() => {
                                         setLearnerToDelete(learner)
                                         setShowDeleteModal(true)
                                         setOpenMenuId(null)
                                       }}
                                       className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                     >
                                       <Trash2 className="w-4 h-4 mr-2" />
                                       Delete
                                     </button>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                              {Math.min(indexOfLastItem, filteredLearners.length)}
                            </span>{' '}
                            of <span className="font-medium">{filteredLearners.length}</span> results
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
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && learnerToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Learner</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{learnerToDelete.first_name} {learnerToDelete.last_name}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setLearnerToDelete(null)
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteLearner(learnerToDelete.id)}
                  disabled={deleteLoading === learnerToDelete.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === learnerToDelete.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Learners
