import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User,
  Bell,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Upload,
  Send
} from 'lucide-react'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

const AddCourse = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(false)

  // Form states
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    department: '',
    level: '',
    estimatedDuration: '',
    deadline: '',
    overview: '',
    learningObjectives: ['Good Medical Practice and Professional Standards'],
    assessmentCriteria: ['Good Medical Practice and Professional Standards'],
    keySkills: ['Good Medical Practice and Professional Standards']
  })

  const [errors, setErrors] = useState({})

  const [courseFiles, setCourseFiles] = useState({
    modules: [],
    practiceFiles: []
  })

  const [fileUploads, setFileUploads] = useState({
    documents: [],
    videos: [],
    practiceFiles: []
  })

  const [assignedLearners, setAssignedLearners] = useState([])
  const [availableLearners, setAvailableLearners] = useState([])

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) return

        const response = await fetch('http://localhost:5000/api/admin/profile', {
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
      }
    }

    fetchProfile()
  }, [])

  // Fetch learners for assignment
  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) return

        const response = await fetch('http://localhost:5000/api/learners', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        
        if (data.success) {
          setAvailableLearners(data.learners)
        }
      } catch (error) {
        console.error('Error fetching learners:', error)
      }
    }

    fetchLearners()
  }, [])

  const handleInputChange = (field, value) => {
    setCourseDetails(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!courseDetails.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!courseDetails.department) {
      newErrors.department = 'Department is required'
    }
    
    if (!courseDetails.level) {
      newErrors.level = 'Level is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addLearningObjective = () => {
    setCourseDetails(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }))
  }

  const updateLearningObjective = (index, value) => {
    setCourseDetails(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => 
        i === index ? value : obj
      )
    }))
  }

  const removeLearningObjective = (index) => {
    setCourseDetails(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }))
  }

  const addAssessmentCriteria = () => {
    setCourseDetails(prev => ({
      ...prev,
      assessmentCriteria: [...prev.assessmentCriteria, '']
    }))
  }

  const updateAssessmentCriteria = (index, value) => {
    setCourseDetails(prev => ({
      ...prev,
      assessmentCriteria: prev.assessmentCriteria.map((criteria, i) => 
        i === index ? value : criteria
      )
    }))
  }

  const removeAssessmentCriteria = (index) => {
    setCourseDetails(prev => ({
      ...prev,
      assessmentCriteria: prev.assessmentCriteria.filter((_, i) => i !== index)
    }))
  }

  const addKeySkill = () => {
    setCourseDetails(prev => ({
      ...prev,
      keySkills: [...prev.keySkills, '']
    }))
  }

  const updateKeySkill = (index, value) => {
    setCourseDetails(prev => ({
      ...prev,
      keySkills: prev.keySkills.map((skill, i) => 
        i === index ? value : skill
      )
    }))
  }

  const removeKeySkill = (index) => {
    setCourseDetails(prev => ({
      ...prev,
      keySkills: prev.keySkills.filter((_, i) => i !== index)
    }))
  }

  const toggleLearnerAssignment = (learnerId) => {
    setAssignedLearners(prev => {
      if (prev.includes(learnerId)) {
        return prev.filter(id => id !== learnerId)
      } else {
        return [...prev, learnerId]
      }
    })
  }

  const handleFileUpload = (type, files) => {
    const fileArray = Array.from(files)
    setFileUploads(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileArray]
    }))
  }

  const removeFile = (type, index) => {
    setFileUploads(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const getConfigurationStatus = () => {
    const detailsComplete = courseDetails.title && courseDetails.department && courseDetails.level
    const filesComplete = fileUploads.documents.length > 0 || fileUploads.videos.length > 0 || fileUploads.practiceFiles.length > 0
    const learnersComplete = assignedLearners.length > 0

    return {
      details: detailsComplete ? 'Added' : 'Not Added',
      files: filesComplete ? 'Uploaded' : 'Not Uploaded',
      learners: learnersComplete ? 'Assigned' : 'Not Assigned'
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('No authentication token')
      }

      // Create course
      const courseResponse = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: courseDetails.title,
          department: courseDetails.department,
          level: courseDetails.level,
          estimated_duration: courseDetails.estimatedDuration,
          deadline: courseDetails.deadline,
          overview: courseDetails.overview,
          learning_objectives: courseDetails.learningObjectives,
          assessment_criteria: courseDetails.assessmentCriteria,
          key_skills: courseDetails.keySkills
        })
      })

      const courseData = await courseResponse.json()
      
      if (!courseData.success) {
        throw new Error(courseData.message || 'Failed to create course')
      }

      // Assign learners if any are selected
      if (assignedLearners.length > 0) {
        const assignResponse = await fetch(`http://localhost:5000/api/courses/${courseData.courseId}/assign-learners`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            learner_ids: assignedLearners
          })
        })

        const assignData = await assignResponse.json()
        
        if (!assignData.success) {
          console.warn('Failed to assign learners:', assignData.message)
        }
      }

      // Navigate to courses list
      navigate('/courses')
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Failed to create course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const status = getConfigurationStatus()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo width={80} height={65} />
            <h1 className="text-2xl font-semibold" style={{ color: '#085EB4' }}>Add Course</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="relative group">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                  {profile?.profile_image ? (
                    <img 
                      src={`http://localhost:5000${profile.profile_image}`}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-400 m-auto" />
                  )}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.email || 'Admin User'
                    }
                  </div>
                  <div className="text-gray-500">{profile?.email || 'Loading...'}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <nav className="px-4 py-6">
            <div className="space-y-2">
              <Link to="/dashboard" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Analytics</span>
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-white rounded-lg transition-all duration-200" style={{ background: 'linear-gradient(90deg, color(display-p3 0.576 0.200 0.918) 0%, color(display-p3 0.231 0.510 0.965) 100%)' }}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium">Courses</span>
              </a>
              
              <Link to="/learners" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Learners</span>
              </Link>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Help</span>
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Bookmarks</span>
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-[color(display-p3_0.576_0.200_0.918)] hover:to-[color(display-p3_0.231_0.510_0.965)]">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </a>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Main Form Area */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Steps */}
              <div className="flex items-center space-x-8 mb-8">
                <div className={`flex items-center space-x-2 ${activeTab === 'details' ? 'text-blue-600' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span>Course Details</span>
                </div>
                <div className={`flex items-center space-x-2 ${activeTab === 'files' ? 'text-blue-600' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeTab === 'files' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span>Course Files</span>
                </div>
                <div className={`flex items-center space-x-2 ${activeTab === 'learners' ? 'text-blue-600' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeTab === 'learners' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span>Assign Learners</span>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Add Course Details</h2>
                  
                  <div className="space-y-6">
                                         {/* Title */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                       <input
                         type="text"
                         value={courseDetails.title}
                         onChange={(e) => handleInputChange('title', e.target.value)}
                         placeholder="Enter title of the course"
                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                           errors.title ? 'border-red-500' : 'border-gray-300'
                         }`}
                       />
                       {errors.title && (
                         <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                       )}
                     </div>

                                         {/* Department & Level */}
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                         <select
                           value={courseDetails.department}
                           onChange={(e) => handleInputChange('department', e.target.value)}
                           className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                             errors.department ? 'border-red-500' : 'border-gray-300'
                           }`}
                         >
                           <option value="">Select Department</option>
                           <option value="Cardiology">Cardiology</option>
                           <option value="Neurology">Neurology</option>
                           <option value="Pediatrics">Pediatrics</option>
                           <option value="Endocrinology">Endocrinology</option>
                           <option value="Surgery">Surgery</option>
                           <option value="Emergency Medicine">Emergency Medicine</option>
                           <option value="Radiology">Radiology</option>
                           <option value="Oncology">Oncology</option>
                           <option value="Psychiatry">Psychiatry</option>
                         </select>
                         {errors.department && (
                           <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                         )}
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                         <select
                           value={courseDetails.level}
                           onChange={(e) => handleInputChange('level', e.target.value)}
                           className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                             errors.level ? 'border-red-500' : 'border-gray-300'
                           }`}
                         >
                           <option value="">Select Level</option>
                           <option value="Beginner">Beginner</option>
                           <option value="Intermediate">Intermediate</option>
                           <option value="Advanced">Advanced</option>
                         </select>
                         {errors.level && (
                           <p className="mt-1 text-sm text-red-600">{errors.level}</p>
                         )}
                       </div>
                     </div>

                    {/* Estimated Duration & Deadline */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
                        <select
                          value={courseDetails.estimatedDuration}
                          onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Estimated Duration</option>
                          <option value="1-2 weeks">1-2 weeks</option>
                          <option value="3-4 weeks">3-4 weeks</option>
                          <option value="1-2 months">1-2 months</option>
                          <option value="3-6 months">3-6 months</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                        <select
                          value={courseDetails.deadline}
                          onChange={(e) => handleInputChange('deadline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Deadline</option>
                          <option value="1 week">1 week</option>
                          <option value="2 weeks">2 weeks</option>
                          <option value="1 month">1 month</option>
                          <option value="3 months">3 months</option>
                        </select>
                      </div>
                    </div>

                    {/* Overview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                      <textarea
                        value={courseDetails.overview}
                        onChange={(e) => handleInputChange('overview', e.target.value)}
                        placeholder="Add Overview"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Learning Objectives */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
                      <div className="space-y-2">
                        {courseDetails.learningObjectives.map((objective, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={objective}
                              onChange={(e) => updateLearningObjective(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {courseDetails.learningObjectives.length > 1 && (
                              <button
                                onClick={() => removeLearningObjective(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addLearningObjective}
                          className="flex items-center text-purple-600 hover:text-purple-800"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Learning Objective
                        </button>
                      </div>
                    </div>

                    {/* Assessment Criteria */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Criteria</label>
                      <div className="space-y-2">
                        {courseDetails.assessmentCriteria.map((criteria, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={criteria}
                              onChange={(e) => updateAssessmentCriteria(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {courseDetails.assessmentCriteria.length > 1 && (
                              <button
                                onClick={() => removeAssessmentCriteria(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addAssessmentCriteria}
                          className="flex items-center text-purple-600 hover:text-purple-800"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Assessment Criteria
                        </button>
                      </div>
                    </div>

                    {/* Key Skills Developed */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills Developed</label>
                      <div className="space-y-2">
                        {courseDetails.keySkills.map((skill, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => updateKeySkill(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {courseDetails.keySkills.length > 1 && (
                              <button
                                onClick={() => removeKeySkill(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addKeySkill}
                          className="flex items-center text-purple-600 hover:text-purple-800"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Key Skills Developed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Course Files</h2>
                  
                  <div className="space-y-6">
                    {/* Add Module */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">Add Module</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Module Heading</label>
                          <input
                            type="text"
                            placeholder="Enter module heading"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              accept=".pdf,.txt,.doc,.docx"
                              onChange={(e) => handleFileUpload('documents', e.target.files)}
                              className="hidden"
                              id="document-upload"
                            />
                            <label htmlFor="document-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Click to upload PDF or Text files (max 1MB)</p>
                            </label>
                          </div>
                          {fileUploads.documents.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {fileUploads.documents.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <button
                                    onClick={() => removeFile('documents', index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Video Heading</label>
                          <input
                            type="text"
                            placeholder="Enter video heading"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              accept=".mp4,.avi,.mov,.wmv"
                              onChange={(e) => handleFileUpload('videos', e.target.files)}
                              className="hidden"
                              id="video-upload"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Click to upload Video files (max 1MB)</p>
                            </label>
                          </div>
                          {fileUploads.videos.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {fileUploads.videos.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <button
                                    onClick={() => removeFile('videos', index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Details</label>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Assessment Name"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              placeholder="Assessment Link"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Add Module
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button className="text-purple-600 hover:text-purple-800">
                        Click to add another module to the course
                      </button>
                    </div>
                    
                    {/* Practice Files */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">Practice Files</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Practice Files</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              accept=".pdf,.txt,.doc,.docx"
                              onChange={(e) => handleFileUpload('practiceFiles', e.target.files)}
                              className="hidden"
                              id="practice-files-upload"
                            />
                            <label htmlFor="practice-files-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Click to upload PDF or Text files (max 5MB)</p>
                            </label>
                          </div>
                          {fileUploads.practiceFiles.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {fileUploads.practiceFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <button
                                    onClick={() => removeFile('practiceFiles', index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Add File
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button className="text-purple-600 hover:text-purple-800">
                        Click to add practice files or supporting documents to the course
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learners' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Assign Learners</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Search"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Sort
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Filter
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {availableLearners.map((learner) => (
                        <div key={learner.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium">{learner.first_name} {learner.last_name}</div>
                              <div className="text-sm text-gray-500">{learner.department} • {learner.experience_level}</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={assignedLearners.includes(learner.id)}
                            onChange={() => toggleLearnerAssignment(learner.id)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            {/* Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if (activeTab === 'files') setActiveTab('details')
                    else if (activeTab === 'learners') setActiveTab('files')
                    else navigate('/courses')
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                {activeTab === 'learners' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      'Publishing...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publish
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (activeTab === 'details') setActiveTab('files')
                      else if (activeTab === 'files') setActiveTab('learners')
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue
                  </button>
                )}
              </div>
            </div>

            {/* Configuration Status */}
            <div>
              <h3 className="text-lg font-medium mb-4">Configuration Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Course Details:</span>
                  <span className={`text-sm font-medium ${status.details === 'Added' ? 'text-green-600' : 'text-orange-600'}`}>
                    {status.details}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Course Files:</span>
                  <span className={`text-sm font-medium ${status.files === 'Uploaded' ? 'text-green-600' : 'text-orange-600'}`}>
                    {status.files}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Learners:</span>
                  <span className={`text-sm font-medium ${status.learners === 'Assigned' ? 'text-green-600' : 'text-orange-600'}`}>
                    {status.learners}
                  </span>
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

export default AddCourse
