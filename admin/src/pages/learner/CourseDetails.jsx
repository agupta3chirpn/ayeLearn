import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft,
  RefreshCw,
  Clock,
  Calendar,
  BookOpen,
  Target,
  Users,
  Award,
  CheckCircle,
  Play
} from 'lucide-react'
import LearnerLayout from '../../components/learner/LearnerLayout'
import axios from 'axios'
import { API_CONFIG } from '../../config/api'

const CourseDetails = () => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('learnerToken')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const response = await axios.get(`${API_CONFIG.ENDPOINTS.COURSES}/${courseId}`)
      
      if (response.data.success) {
        setCourse(response.data.data)
      } else {
        setError('Failed to fetch course details')
      }
    } catch (error) {
      console.error('Error fetching course details:', error)
      setError('Failed to fetch course details')
    } finally {
      setLoading(false)
    }
  }

  const handleContinueCourse = () => {
    // Navigate to course content or first module
    navigate(`/learner/courses/${courseId}/content`)
  }

  const handleTakeAssessment = () => {
    // Navigate to assessment
    navigate(`/learner/courses/${courseId}/assessment`)
  }

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
            <span className="ml-2 text-gray-600">Loading course details...</span>
          </div>
        </div>
      </LearnerLayout>
    )
  }

  if (error || !course) {
    return (
      <LearnerLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Course Not Found</h3>
            <p className="text-gray-600 mb-4">{error || 'The requested course could not be found.'}</p>
            <button
              onClick={() => navigate('/learner/dashboard')}
              className="px-4 py-2 text-white rounded-lg font-medium transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </LearnerLayout>
    )
  }

  return (
    <LearnerLayout>
      <div className="p-6">
        <div className="container mx-auto">
          {/* Header with Back and Refresh */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/learner/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
              <button
                onClick={fetchCourseDetails}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                <button
                  onClick={handleContinueCourse}
                  className="px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }}
                >
                  Continue Course
                </button>
                <button
                  onClick={handleTakeAssessment}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Take Assessment
                </button>
              </div>
            </div>
          </div>

          {/* Course Details Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {/* Course Title and Metadata */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title || 'Untitled Course'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {course.department || 'General'}
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
                  {course.level || 'Beginner'}
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {course.completed_modules || 0} of {course.total_modules || 0} modules completed
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Estimated Duration: {course.duration || '1 week'}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due by: {course.due_date ? new Date(course.due_date).toLocaleDateString() : 'No due date'}
                </span>
              </div>
            </div>

            {/* Course Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Overview and Target Audience */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Overview
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {course.overview || 'This course provides comprehensive training on the subject matter, covering essential concepts, practical applications, and real-world scenarios. Learners will gain hands-on experience and develop the skills necessary to excel in their field.'}
                  </p>
                </div>

                {/* Target Audience */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Target Audience
                  </h2>
                  <p className="text-gray-700">
                    {course.target_audience || 'General learners'}
                  </p>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Learning Objectives
                  </h2>
                  <p className="text-gray-700 mb-4">
                    By the end of this course, learners will be able to:
                  </p>
                  <ul className="space-y-2">
                    {course.learning_objectives ? (
                      course.learning_objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Understand fundamental concepts and principles</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Apply theoretical knowledge to practical scenarios</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Develop critical thinking and problem-solving skills</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Master industry-standard tools and techniques</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Prepare for professional certification and advancement</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Modules Included */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Modules Included
                  </h2>
                  <div className="space-y-4">
                    {course.modules ? (
                      course.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                          <div className="space-y-2">
                            {module.lessons && module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center">
                                <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                                <span className="text-gray-700">{lesson.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Introduction to Core Concepts</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                              <span className="text-gray-700">Lesson 1: Introduction to Fundamentals</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                              <span className="text-gray-700">Lesson 2: Basic Principles</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                              <span className="text-gray-700">Lesson 3: Core Framework</span>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Advanced Applications</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                              <span className="text-gray-700">Lesson 4: Advanced Techniques</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                              <span className="text-gray-700">Lesson 5: Best Practices</span>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Practical Implementation</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                              <span className="text-gray-700">Lesson 6: Real-world Applications</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                              <span className="text-gray-700">Lesson 7: Case Studies</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                              <span className="text-gray-700">Lesson 8: Final Assessment</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Key Skills and Assessment Criteria */}
              <div className="space-y-8">
                {/* Key Skills Developed */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Key Skills Developed</h2>
                  <ul className="space-y-2">
                    {course.key_skills ? (
                      course.key_skills.map((skill, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{skill}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Technical proficiency in core concepts</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Problem-solving and analytical thinking</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Practical application of theoretical knowledge</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Industry-standard tool utilization</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Professional communication and collaboration</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Assessment Criteria */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment Criteria</h2>
                  <ul className="space-y-2">
                    {course.assessment_criteria ? (
                      course.assessment_criteria.map((criterion, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{criterion}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Understanding of fundamental principles</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Alignment with industry frameworks</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Competence in risk identification</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Implementation of best practices</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">Demonstration of practical skills</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LearnerLayout>
  )
}

export default CourseDetails
