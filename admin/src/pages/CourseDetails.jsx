import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import API_CONFIG from '../config/api'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const CourseDetails = () => {
  console.log('CourseDetails component initialized')
  
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [learners, setLearners] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState({})
  const [error, setError] = useState(null)

  // Simple test render to verify component loads
  console.log('CourseDetails rendering with ID:', id)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      console.log('Fetching course details for ID:', id)
      console.log('API_CONFIG.ENDPOINTS.COURSES:', API_CONFIG.ENDPOINTS.COURSES)
      
      try {
        const courseUrl = `${API_CONFIG.ENDPOINTS.COURSES}/${id}`
        const learnersUrl = `${API_CONFIG.ENDPOINTS.COURSES}/${id}/learners`
        
        console.log('Course URL:', courseUrl)
        console.log('Learners URL:', learnersUrl)
        
        const [courseResponse, learnersResponse] = await Promise.all([
          axios.get(courseUrl),
          axios.get(learnersUrl)
        ])

        console.log('Course response:', courseResponse.data)
        console.log('Learners response:', learnersResponse.data)

        if (courseResponse.data.success) {
          const courseData = courseResponse.data.course
          
          // Parse JSON fields if they're strings
          if (courseData.learning_objectives && typeof courseData.learning_objectives === 'string') {
            try {
              courseData.learning_objectives = JSON.parse(courseData.learning_objectives)
            } catch (e) {
              console.error('Error parsing learning_objectives:', e)
              courseData.learning_objectives = []
            }
          }
          
          if (courseData.assessment_criteria && typeof courseData.assessment_criteria === 'string') {
            try {
              courseData.assessment_criteria = JSON.parse(courseData.assessment_criteria)
            } catch (e) {
              console.error('Error parsing assessment_criteria:', e)
              courseData.assessment_criteria = []
            }
          }
          
          if (courseData.key_skills && typeof courseData.key_skills === 'string') {
            try {
              courseData.key_skills = JSON.parse(courseData.key_skills)
            } catch (e) {
              console.error('Error parsing key_skills:', e)
              courseData.key_skills = []
            }
          }
          
          console.log('Processed course data:', courseData)
          
          // Ensure all array fields are arrays
          if (!Array.isArray(courseData.learning_objectives)) {
            courseData.learning_objectives = []
          }
          if (!Array.isArray(courseData.assessment_criteria)) {
            courseData.assessment_criteria = []
          }
          if (!Array.isArray(courseData.key_skills)) {
            courseData.key_skills = []
          }
          if (!Array.isArray(courseData.modules)) {
            courseData.modules = []
          }
          
          setCourse(courseData)
        } else {
          console.error('Course API returned success: false')
        }

        if (learnersResponse.data.success) {
          setLearners(learnersResponse.data.learners || [])
        } else {
          console.error('Learners API returned success: false')
        }
      } catch (error) {
        console.error('Error fetching course details:', error)
        console.error('Error details:', error.response?.data || error.message)
        setError(error.message || 'Failed to fetch course details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourseDetails()
    } else {
      console.error('No course ID provided')
      setLoading(false)
    }
  }, [id])

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  console.log('CourseDetails component rendering, loading:', loading, 'course:', course, 'id:', id)
  
  // Simple test to see if component renders
  console.log('Component is rendering!')
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course details...</p>
              <p className="text-sm text-gray-500 mt-2">Course ID: {id}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Error Loading Course</h2>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Course Not Found</h2>
              <p className="text-gray-500">The course you're looking for doesn't exist.</p>
              <p className="text-sm text-gray-400 mt-2">Course ID: {id}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link to="/dashboard" className="hover:text-purple-600">← Dashboard</Link>
              <span>{'>'}</span>
              <Link to="/courses" className="hover:text-purple-600">Courses</Link>
              <span>{'>'}</span>
              <span className="text-gray-900">{course.title}</span>
            </nav>

            {/* Course Title and Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-lg text-gray-600">{course.department} • {course.level}</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Estimated Duration: {course.estimated_duration || 'Not set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Due by: {formatDate(course.deadline)}</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            {course.overview && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed">{course.overview}</p>
              </div>
            )}

            {/* Learning Objectives */}
            {course.learning_objectives && Array.isArray(course.learning_objectives) && course.learning_objectives.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Objectives</h2>
                <ul className="space-y-2">
                  {course.learning_objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modules */}
            {course.modules && Array.isArray(course.modules) && course.modules.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Modules Added</h2>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View Overall Report
                  </button>
                </div>
                
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={module.id || index} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleModule(module.id || index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                      >
                        <h3 className="text-lg font-medium text-gray-900">{module.heading}</h3>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transform transition-transform ${
                            expandedModules[module.id || index] ? 'rotate-180' : ''
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      
                                             {expandedModules[module.id || index] && (
                                                   <div className="px-4 pb-4">
                           
                           {module.assessment_name && (
                             <div>
                               <h4 className="text-sm font-medium text-gray-700 mb-2">Assessment:</h4>
                               <div className="text-sm text-gray-600">
                                 {module.assessment_name}
                               </div>
                             </div>
                           )}
                           
                           {module.documents && module.documents.length > 0 && (
                             <div className="mt-4">
                               <h4 className="text-sm font-medium text-gray-700 mb-2">Documents:</h4>
                               <div className="space-y-2">
                                 {module.documents.map((doc, docIdx) => (
                                   <div key={docIdx} className="flex items-center space-x-2 text-sm">
                                     <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                     </svg>
                                                                                                                  <a 
                                         href={`${API_CONFIG.BASE_URL}${doc.file_path}`}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
                                       >
                                        <span>{doc.original_name || doc.file_name || 'Document'}</span>
                                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                       </svg>
                                     </a>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                           
                           {module.videos && module.videos.length > 0 && (
                             <div className="mt-4">
                               <h4 className="text-sm font-medium text-gray-700 mb-2">Videos:</h4>
                               <div className="space-y-2">
                                 {module.videos.map((video, videoIdx) => (
                                   <div key={videoIdx} className="flex items-center space-x-2 text-sm">
                                     <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                     </svg>
                                                                                                                  <a 
                                         href={`${API_CONFIG.BASE_URL}${video.file_path}`}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
                                       >
                                        <span>{video.original_name || video.file_name || 'Video'}</span>
                                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                       </svg>
                                     </a>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            {/* Edit Course Button */}
            <Link
              to={`/edit-course/${id}`}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Course</span>
            </Link>

                         {/* Learners Section */}
             <div className="mb-6">
               <div className="mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">Learners</h3>
               </div>
               <p className="text-sm text-gray-600 mb-4">{learners.length} Learners</p>
               
                               <div className="space-y-3">
                  {Array.isArray(learners) && learners.slice(0, 4).map((learner) => (
                    <div key={learner.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                             <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                         {learner.avatar_url ? (
                           <img 
                             src={`${API_CONFIG.BASE_URL}${learner.avatar_url}`}
                             alt={`${learner.first_name} ${learner.last_name}`}
                             className="w-full h-full object-cover"
                             onError={(e) => {
                               e.target.style.display = 'none';
                               e.target.nextSibling.style.display = 'flex';
                             }}
                           />
                         ) : null}
                         <div className={`w-full h-full bg-purple-600 rounded-full flex items-center justify-center ${learner.avatar_url ? 'hidden' : ''}`}>
                          <span className="text-white text-xs font-medium">
                            {getInitials(learner.first_name, learner.last_name)}
                          </span>
                        </div>
                      </div>
                     <div className="flex-1">
                       <p className="text-sm font-medium text-gray-900">
                         {learner.first_name} {learner.last_name}
                       </p>
                       <p className="text-xs text-gray-500">
                         {learner.department || 'General'} • {learner.experience_level || 'Beginner'}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

            {/* Statistics Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium text-gray-900">60%</span>
                </div>
                <div className="relative h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    {/* Grid lines */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#e5e7eb" strokeWidth="0.5" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#e5e7eb" strokeWidth="0.5" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#e5e7eb" strokeWidth="0.5" />
                    
                    {/* Chart line */}
                    <path
                      d="M0 35 L25 25 L50 15 L75 20 L100 10"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Area fill */}
                    <path
                      d="M0 35 L25 25 L50 15 L75 20 L100 10 L100 40 L0 40 Z"
                      fill="url(#gradient)"
                    />
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Data points */}
                    <circle cx="25" cy="25" r="2" fill="#8b5cf6" />
                    <circle cx="50" cy="15" r="2" fill="#8b5cf6" />
                    <circle cx="75" cy="20" r="2" fill="#8b5cf6" />
                    <circle cx="100" cy="10" r="2" fill="#8b5cf6" />
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CourseDetails
