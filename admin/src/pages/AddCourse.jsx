import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  User,
  Bell,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Plus,
  X,
  Upload,
  Send,
  BookOpen,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Target,
  Award,
  FileVideo,
  FileImage,
  UserPlus,
  Filter,
  Search
} from 'lucide-react'
import Logo from '../components/Logo'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer'
import { API_CONFIG } from '../config/api'

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
    learningObjectives: [''],
    assessmentCriteria: [''],
    keySkills: ['']
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

  const [uploadedFiles, setUploadedFiles] = useState({
    documents: [],
    videos: [],
    practiceFiles: []
  })

  const [fileValidation, setFileValidation] = useState({
    practiceFiles: { isValid: true, message: '' }
  })

  const [totalFileSize, setTotalFileSize] = useState(0)
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per file
  const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB total

  const [modules, setModules] = useState([
    {
      id: 1,
      heading: '',
      documents: [],
      videoHeading: '',
      videos: [],
      assessmentName: '',
      assessmentLink: ''
    }
  ])

  const [assignedLearners, setAssignedLearners] = useState([])
  const [availableLearners, setAvailableLearners] = useState([])
  const [learnersLoading, setLearnersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_CONFIG.ENDPOINTS.ADMIN_PROFILE)
        
        if (response.data.success) {
          setProfile(response.data.profile)
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
      setLearnersLoading(true)
      try {
        const response = await axios.get(API_CONFIG.ENDPOINTS.LEARNERS)
        
        if (response.data.success) {
          const learners = response.data.data || []
          setAvailableLearners(learners)
        } else {
          console.error('Failed to fetch learners:', response.data.message)
          setAvailableLearners([])
        }
      } catch (error) {
        console.error('Error fetching learners:', error)
        setAvailableLearners([])
      } finally {
        setLearnersLoading(false)
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
    
    if (!courseDetails.overview.trim()) {
      newErrors.overview = 'Overview is required'
    }
    
    // Validate learning objectives
    const validLearningObjectives = courseDetails.learningObjectives.filter(obj => obj.trim() !== '')
    if (validLearningObjectives.length === 0) {
      newErrors.learningObjectives = 'At least one learning objective is required'
    }
    
    // Validate assessment criteria
    const validAssessmentCriteria = courseDetails.assessmentCriteria.filter(criteria => criteria.trim() !== '')
    if (validAssessmentCriteria.length === 0) {
      newErrors.assessmentCriteria = 'At least one assessment criteria is required'
    }
    
    // Validate key skills
    const validKeySkills = courseDetails.keySkills.filter(skill => skill.trim() !== '')
    if (validKeySkills.length === 0) {
      newErrors.keySkills = 'At least one key skill is required'
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

  const selectAllLearners = () => {
    const filteredLearners = getFilteredLearners()
    const allLearnerIds = filteredLearners.map(learner => learner.id)
    setAssignedLearners(allLearnerIds)
  }

  const clearAllSelections = () => {
    setAssignedLearners([])
  }

  const getFilteredLearners = () => {
    if (!availableLearners || !Array.isArray(availableLearners)) {
      return []
    }
    
    return availableLearners.filter((learner) => {
      const firstName = (learner.first_name ?? '').toString().toLowerCase()
      const lastName = (learner.last_name ?? '').toString().toLowerCase()
      const department = (learner.department ?? '').toString().toLowerCase()
      const level = (learner.experience_level ?? '').toString().toLowerCase()

      const search = (searchTerm ?? '').toString().toLowerCase()

      const matchesSearch =
        firstName.includes(search) ||
        lastName.includes(search) ||
        department.includes(search) ||
        level.includes(search)

      const matchesDepartment =
        !filterDepartment || (learner.department ?? '') === filterDepartment

      const matchesLevel = !filterLevel || (learner.experience_level ?? '') === filterLevel

      return matchesSearch && matchesDepartment && matchesLevel
    })
  }

  const getSortedLearners = (learners) => {
    return [...learners].sort((a, b) => {
      switch (sortBy) {
        case 'name': {
          const aName = `${a.first_name ?? ''} ${a.last_name ?? ''}`
          const bName = `${b.first_name ?? ''} ${b.last_name ?? ''}`
          return aName.localeCompare(bName)
        }
        case 'department': {
          const aDept = (a.department ?? '').toString()
          const bDept = (b.department ?? '').toString()
          return aDept.localeCompare(bDept)
        }
        case 'level': {
          const aLevel = (a.experience_level ?? '').toString()
          const bLevel = (b.experience_level ?? '').toString()
          return aLevel.localeCompare(bLevel)
        }
        default:
          return 0
      }
    })
  }

  const getUniqueDepartments = () => {
    if (!availableLearners || !Array.isArray(availableLearners)) {
      return []
    }
    return [...new Set(availableLearners.map((learner) => learner.department ?? ''))].filter(
      (val) => val !== ''
    )
  }

  const getUniqueLevels = () => {
    if (!availableLearners || !Array.isArray(availableLearners)) {
      return []
    }
    return [...new Set(availableLearners.map((learner) => learner.experience_level ?? ''))].filter(
      (val) => val !== ''
    )
  }

  const validateFile = (file, type) => {
    const allowedTypes = {
      practiceFiles: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      documents: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      videos: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv']
    }

    // Check file type
    if (!allowedTypes[type].includes(file.type)) {
      return {
        isValid: false,
        message: `Invalid file type. Allowed types: ${type === 'practiceFiles' ? 'PDF, DOC, DOCX, TXT' : type === 'documents' ? 'PDF, DOC, DOCX, TXT' : 'MP4, AVI, MOV, WMV'}`
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        message: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
      }
    }

    // Check total size
    const currentTotalSize = totalFileSize + file.size
    if (currentTotalSize > MAX_TOTAL_SIZE) {
      return {
        isValid: false,
        message: `Total file size would exceed ${MAX_TOTAL_SIZE / (1024 * 1024)}MB limit`
      }
    }

    return { isValid: true, message: '' }
  }

  const handleFileUpload = async (type, files) => {
    const fileArray = Array.from(files)
    
    // Validate all files first
    for (const file of fileArray) {
      const validation = validateFile(file, type)
      if (!validation.isValid) {
        setFileValidation(prev => ({
          ...prev,
          [type]: validation
        }))
        return
      }
    }

    // Clear validation errors
    setFileValidation(prev => ({
      ...prev,
      [type]: { isValid: true, message: '' }
    }))

    // Update file uploads and total size
    setFileUploads(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileArray]
    }))

    setTotalFileSize(prev => prev + fileArray.reduce((sum, file) => sum + file.size, 0))

    // Upload files to server
    for (const file of fileArray) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type) // This will be 'practiceFiles', 'documents', or 'videos'
        
        const response = await axios.post(API_CONFIG.ENDPOINTS.UPLOAD_COURSE_FILE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
        
        if (response.data.success) {
          setUploadedFiles(prev => ({
            ...prev,
            [type]: [...prev[type], {
              originalName: file.name,
              fileName: response.data.fileName,
              filePath: response.data.filePath,
              fileType: response.data.fileType,
              fileSize: response.data.fileSize || file.size
            }]
          }))
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        // Remove file from uploads if server upload failed
        setFileUploads(prev => ({
          ...prev,
          [type]: prev[type].filter(f => f.name !== file.name)
        }))
        setTotalFileSize(prev => prev - file.size)
        setFileValidation(prev => ({
          ...prev,
          [type]: { isValid: false, message: `Failed to upload ${file.name}` }
        }))
      }
    }
  }

  const removeFile = (type, index) => {
    const fileToRemove = fileUploads[type][index]
    
    setFileUploads(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))

    // Update total file size
    setTotalFileSize(prev => prev - (fileToRemove.size || 0))

    // Remove from uploaded files if exists
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))

    // Clear validation errors
    setFileValidation(prev => ({
      ...prev,
      [type]: { isValid: true, message: '' }
    }))
  }

  const clearAllPracticeFiles = () => {
    const practiceFilesSize = fileUploads.practiceFiles.reduce((sum, file) => sum + (file.size || 0), 0)
    
    setFileUploads(prev => ({
      ...prev,
      practiceFiles: []
    }))

    setUploadedFiles(prev => ({
      ...prev,
      practiceFiles: []
    }))

    setTotalFileSize(prev => prev - practiceFilesSize)

    setFileValidation(prev => ({
      ...prev,
      practiceFiles: { isValid: true, message: '' }
    }))
  }

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      heading: '',
      documents: [],
      videoHeading: '',
      videos: [],
      assessmentName: '',
      assessmentLink: ''
    }
    setModules(prev => [...prev, newModule])
  }

  const removeModule = (moduleId) => {
    setModules(prev => prev.filter(module => module.id !== moduleId))
  }

  const updateModule = (moduleId, field, value) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, [field]: value } : module
    ))
  }

  const handleModuleFileUpload = async (moduleId, type, files) => {
    const fileArray = Array.from(files)
    
    // Validate all files first
    for (const file of fileArray) {
      const validation = validateFile(file, type)
      if (!validation.isValid) {
        setFileValidation(prev => ({
          ...prev,
          [`module_${moduleId}_${type}`]: validation
        }))
        return
      }
    }

    // Clear validation errors
    setFileValidation(prev => ({
      ...prev,
      [`module_${moduleId}_${type}`]: { isValid: true, message: '' }
    }))

    // Update modules and total size
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, [type]: [...module[type], ...fileArray] }
        : module
    ))

    setTotalFileSize(prev => prev + fileArray.reduce((sum, file) => sum + file.size, 0))

    // Upload files to server
    for (const file of fileArray) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type) // This will be 'documents' or 'videos'
        formData.append('moduleId', moduleId)
        
        const response = await axios.post(API_CONFIG.ENDPOINTS.UPLOAD_COURSE_FILE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
        
        if (response.data.success) {
          setModules(prev => prev.map(module => 
            module.id === moduleId 
              ? { 
                  ...module, 
                  uploadedFiles: {
                    ...module.uploadedFiles,
                    [type]: [...(module.uploadedFiles?.[type] || []), {
                      originalName: file.name,
                      fileName: response.data.fileName,
                      filePath: response.data.filePath,
                      fileType: response.data.fileType,
                      fileSize: response.data.fileSize || file.size
                    }]
                  }
                }
              : module
          ))
        }
      } catch (error) {
        console.error('Error uploading module file:', error)
        // Remove file from modules if server upload failed
        setModules(prev => prev.map(module => 
          module.id === moduleId 
            ? { ...module, [type]: module[type].filter(f => f.name !== file.name) }
            : module
        ))
        setTotalFileSize(prev => prev - file.size)
        setFileValidation(prev => ({
          ...prev,
          [`module_${moduleId}_${type}`]: { isValid: false, message: `Failed to upload ${file.name}` }
        }))
      }
    }
  }

  const removeModuleFile = (moduleId, type, index) => {
    const module = modules.find(m => m.id === moduleId)
    const fileToRemove = module?.[type]?.[index]
    
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, [type]: module[type].filter((_, i) => i !== index) }
        : module
    ))

    // Update total file size
    if (fileToRemove?.size) {
      setTotalFileSize(prev => prev - fileToRemove.size)
    }

    // Remove from uploaded files if exists
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { 
            ...module, 
            uploadedFiles: {
              ...module.uploadedFiles,
              [type]: module.uploadedFiles?.[type]?.filter((_, i) => i !== index) || []
            }
          }
        : module
    ))

    // Clear validation errors
    setFileValidation(prev => ({
      ...prev,
      [`module_${moduleId}_${type}`]: { isValid: true, message: '' }
    }))
  }

  const validateStep2 = () => {
    // Check if at least one module has files
    const hasModuleFiles = modules.some(module => 
      module.documents.length > 0 || module.videos.length > 0
    )
    
    // Check if practice files are uploaded
    const hasPracticeFiles = fileUploads.practiceFiles.length > 0
    
    // Check if there are any validation errors
    const hasValidationErrors = Object.values(fileValidation).some(validation => !validation.isValid)
    
    return (hasModuleFiles || hasPracticeFiles) && !hasValidationErrors
  }

  const getConfigurationStatus = () => {
    const detailsComplete = courseDetails.title && courseDetails.department && courseDetails.level && courseDetails.overview.trim() &&
      courseDetails.learningObjectives.some(obj => obj.trim() !== '') &&
      courseDetails.assessmentCriteria.some(criteria => criteria.trim() !== '') &&
      courseDetails.keySkills.some(skill => skill.trim() !== '')
    
    const filesComplete = validateStep2()
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
      // Create course
      const courseResponse = await axios.post(API_CONFIG.ENDPOINTS.COURSES, {
        title: courseDetails.title,
        department: courseDetails.department,
        level: courseDetails.level,
        estimated_duration: courseDetails.estimatedDuration,
        deadline: courseDetails.deadline,
        overview: courseDetails.overview,
        learning_objectives: courseDetails.learningObjectives.filter(obj => obj.trim() !== ''),
        assessment_criteria: courseDetails.assessmentCriteria.filter(criteria => criteria.trim() !== ''),
        key_skills: courseDetails.keySkills.filter(skill => skill.trim() !== ''),
        modules: modules.map(module => ({
          heading: module.heading,
          videoHeading: module.videoHeading,
          assessmentName: module.assessmentName,
          assessmentLink: module.assessmentLink,
          documents: module.uploadedFiles?.documents || [],
          videos: module.uploadedFiles?.videos || []
        })),
        practiceFiles: uploadedFiles.practiceFiles
      })

      if (!courseResponse.data.success) {
        throw new Error(courseResponse.data.message || 'Failed to create course')
      }

      // Assign learners if any are selected
      if (assignedLearners.length > 0) {
        const assignResponse = await axios.post(`${API_CONFIG.ENDPOINTS.COURSES}/${courseResponse.data.courseId}/assign-learners`, {
          learner_ids: assignedLearners
        })
        
        if (!assignResponse.data.success) {
          console.warn('Failed to assign learners:', assignResponse.data.message)
        }
      }

      // Navigate to courses list after successful creation
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Header */}
      <Header />



      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />


        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Main Form Area */}
          <div className="flex-1 p-8">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10">
              {/* Enhanced Steps */}
              <div className="flex items-center justify-center space-x-16 mb-12">
                <div className={`flex flex-col items-center space-y-3 ${activeTab === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                    activeTab === 'details' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl scale-110 ring-4 ring-blue-200' 
                      : 'bg-gray-100 text-gray-500 hover:scale-105'
                  }`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Course Details</span>
                  {activeTab === 'details' && (
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className={`w-24 h-1 rounded-full transition-all duration-500 ${activeTab === 'files' || activeTab === 'learners' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'}`}></div>
                
                <div className={`flex flex-col items-center space-y-3 ${activeTab === 'files' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                    activeTab === 'files' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl scale-110 ring-4 ring-blue-200' 
                      : 'bg-gray-100 text-gray-500 hover:scale-105'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Course Files</span>
                  {activeTab === 'files' && (
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className={`w-24 h-1 rounded-full transition-all duration-500 ${activeTab === 'learners' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'}`}></div>
                
                <div className={`flex flex-col items-center space-y-3 ${activeTab === 'learners' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                    activeTab === 'learners' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl scale-110 ring-4 ring-blue-200' 
                      : 'bg-gray-100 text-gray-500 hover:scale-105'
                  }`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold">Assign Learners</span>
                  {activeTab === 'learners' && (
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div>
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">Course Details</h2>
                    <p className="text-lg text-gray-600">Fill in the comprehensive information about your course</p>
                  </div>
                  
                  <div className="w-full space-y-8">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Title*
                          </label>
                          <input
                            type="text"
                            value={courseDetails.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter course title"
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          />
                          {errors.title && (
                            <div className="mt-2 flex items-center">
                              <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <p className="text-sm text-red-600 font-medium">{errors.title}</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department*
                          </label>
                          <select
                            value={courseDetails.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.department ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
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
                            <div className="mt-2 flex items-center">
                              <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <p className="text-sm text-red-600 font-medium">{errors.department}</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience Level*
                          </label>
                          <select
                            value={courseDetails.level}
                            onChange={(e) => handleInputChange('level', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.level ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                          {errors.level && (
                            <div className="mt-2 flex items-center">
                              <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <p className="text-sm text-red-600 font-medium">{errors.level}</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Duration
                          </label>
                          <select
                            value={courseDetails.estimatedDuration}
                            onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                          >
                            <option value="">Select Duration</option>
                            <option value="1-2 weeks">1-2 weeks</option>
                            <option value="3-4 weeks">3-4 weeks</option>
                            <option value="1-2 months">1-2 months</option>
                            <option value="3-6 months">3-6 months</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Deadline
                          </label>
                          <select
                            value={courseDetails.deadline}
                            onChange={(e) => handleInputChange('deadline', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                          >
                            <option value="">Select Deadline</option>
                            <option value="1 week">1 week</option>
                            <option value="2 weeks">2 weeks</option>
                            <option value="1 month">1 month</option>
                            <option value="3 months">3 months</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Course Overview */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Course Overview</h3>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Overview
                        </label>
                        <textarea
                          value={courseDetails.overview}
                          onChange={(e) => handleInputChange('overview', e.target.value)}
                          placeholder="Describe what learners will gain from this course..."
                          rows={5}
                          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                            errors.overview ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        />
                        {errors.overview && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.overview}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <Target className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Learning Objectives</h3>
                      </div>
                      <div className="space-y-3">
                        {courseDetails.learningObjectives.map((objective, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                            </div>
                            <input
                              type="text"
                              value={objective}
                              onChange={(e) => updateLearningObjective(index, e.target.value)}
                              placeholder="Enter learning objective..."
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                            />
                            {courseDetails.learningObjectives.length > 1 && (
                              <button
                                onClick={() => removeLearningObjective(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addLearningObjective}
                          className="flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Learning Objective
                        </button>
                        {errors.learningObjectives && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.learningObjectives}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assessment Criteria */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <Award className="w-4 h-4 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Assessment Criteria</h3>
                      </div>
                      <div className="space-y-3">
                        {courseDetails.assessmentCriteria.map((criteria, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                            </div>
                            <input
                              type="text"
                              value={criteria}
                              onChange={(e) => updateAssessmentCriteria(index, e.target.value)}
                              placeholder="Enter assessment criteria..."
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                            />
                            {courseDetails.assessmentCriteria.length > 1 && (
                              <button
                                onClick={() => removeAssessmentCriteria(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addAssessmentCriteria}
                          className="flex items-center text-orange-600 hover:text-orange-800 font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Assessment Criteria
                        </button>
                        {errors.assessmentCriteria && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.assessmentCriteria}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key Skills Developed */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <Award className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Key Skills Developed</h3>
                      </div>
                      <div className="space-y-3">
                        {courseDetails.keySkills.map((skill, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-indigo-600">{index + 1}</span>
                            </div>
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => updateKeySkill(index, e.target.value)}
                              placeholder="Enter key skill..."
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                            />
                            {courseDetails.keySkills.length > 1 && (
                              <button
                                onClick={() => removeKeySkill(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addKeySkill}
                          className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Key Skill
                        </button>
                        {errors.keySkills && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.keySkills}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div>
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">Course Files</h2>
                    <p className="text-lg text-gray-600">Upload course materials and resources</p>
                  </div>
                  
                  <div className="w-full space-y-8">
                    {/* Course Modules */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
                        </div>
                        <button
                          onClick={addModule}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Module
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        {modules.map((module, moduleIndex) => (
                          <div key={module.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-blue-600">{moduleIndex + 1}</span>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">Module {moduleIndex + 1}</h4>
                              </div>
                              {modules.length > 1 && (
                                <button
                                  onClick={() => removeModule(module.id)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                            
                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Module Heading
                                </label>
                                <input
                                  type="text"
                                  value={module.heading}
                                  onChange={(e) => updateModule(module.id, 'heading', e.target.value)}
                                  placeholder="Enter module heading"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Upload Documents
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                  fileValidation[`module_${module.id}_documents`]?.isValid !== false
                                    ? 'border-gray-300 hover:border-blue-400' 
                                    : 'border-red-300 bg-red-50'
                                }`}>
                                  <input
                                    type="file"
                                    accept=".pdf,.txt,.doc,.docx"
                                    onChange={(e) => handleModuleFileUpload(module.id, 'documents', e.target.files)}
                                    className="hidden"
                                    id={`document-upload-${module.id}`}
                                    multiple
                                  />
                                  <label htmlFor={`document-upload-${module.id}`} className="cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload multiple PDF, DOC, DOCX, or TXT files</p>
                                    <p className="text-xs text-gray-500">Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB</p>
                                  </label>
                                </div>
                                
                                {/* Validation Error */}
                                {fileValidation[`module_${module.id}_documents`]?.isValid === false && (
                                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center">
                                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                      <p className="text-sm text-red-600">{fileValidation[`module_${module.id}_documents`].message}</p>
                                    </div>
                                  </div>
                                )}
                                {module.documents.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                    {module.documents.map((file, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-3">
                                          <FileText className="w-4 h-4 text-blue-500" />
                                          <div>
                                            <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                                            <p className="text-xs text-gray-500">
                                              {(file.size / (1024 * 1024)).toFixed(2)}MB
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => removeModuleFile(module.id, 'documents', index)}
                                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Video Heading
                                </label>
                                <input
                                  type="text"
                                  value={module.videoHeading}
                                  onChange={(e) => updateModule(module.id, 'videoHeading', e.target.value)}
                                  placeholder="Enter video heading"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Upload Videos
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                  fileValidation[`module_${module.id}_videos`]?.isValid !== false
                                    ? 'border-gray-300 hover:border-red-400' 
                                    : 'border-red-300 bg-red-50'
                                }`}>
                                  <input
                                    type="file"
                                    accept=".mp4,.avi,.mov,.wmv"
                                    onChange={(e) => handleModuleFileUpload(module.id, 'videos', e.target.files)}
                                    className="hidden"
                                    id={`video-upload-${module.id}`}
                                    multiple
                                  />
                                  <label htmlFor={`video-upload-${module.id}`} className="cursor-pointer">
                                    <FileVideo className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload multiple video files</p>
                                    <p className="text-xs text-gray-500">Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB</p>
                                  </label>
                                </div>
                                
                                {/* Validation Error */}
                                {fileValidation[`module_${module.id}_videos`]?.isValid === false && (
                                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center">
                                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                      <p className="text-sm text-red-600">{fileValidation[`module_${module.id}_videos`].message}</p>
                                    </div>
                                  </div>
                                )}
                                {module.videos.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                    {module.videos.map((file, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-3">
                                          <FileVideo className="w-4 h-4 text-red-500" />
                                          <div>
                                            <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                                            <p className="text-xs text-gray-500">
                                              {(file.size / (1024 * 1024)).toFixed(2)}MB
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => removeModuleFile(module.id, 'videos', index)}
                                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Assessment Details
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <input
                                    type="text"
                                    value={module.assessmentName}
                                    onChange={(e) => updateModule(module.id, 'assessmentName', e.target.value)}
                                    placeholder="Assessment Name"
                                    className="px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                                  />
                                  <input
                                    type="text"
                                    value={module.assessmentLink}
                                    onChange={(e) => updateModule(module.id, 'assessmentLink', e.target.value)}
                                    placeholder="Assessment Link"
                                    className="px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practice Files */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <FileImage className="w-4 h-4 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Practice Files</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Total Size: {(totalFileSize / (1024 * 1024)).toFixed(2)}MB / {(MAX_TOTAL_SIZE / (1024 * 1024)).toFixed(0)}MB
                          </p>
                          <p className="text-xs text-gray-500">
                            Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Practice Files
                          </label>
                          <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            fileValidation.practiceFiles.isValid 
                              ? 'border-gray-300 hover:border-green-400' 
                              : 'border-red-300 bg-red-50'
                          }`}>
                            <input
                              type="file"
                              accept=".pdf,.txt,.doc,.docx"
                              onChange={(e) => handleFileUpload('practiceFiles', e.target.files)}
                              className="hidden"
                              id="practice-files-upload"
                              multiple
                            />
                            <label htmlFor="practice-files-upload" className="cursor-pointer">
                              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                              <p className="text-sm text-gray-600 mb-1">Click to upload multiple PDF, DOC, DOCX, or TXT files</p>
                              <p className="text-xs text-gray-500">
                                Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB | Total limit: {MAX_TOTAL_SIZE / (1024 * 1024)}MB
                              </p>
                            </label>
                          </div>
                          
                          {/* Validation Error */}
                          {!fileValidation.practiceFiles.isValid && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center">
                                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                <p className="text-sm text-red-600">{fileValidation.practiceFiles.message}</p>
                              </div>
                            </div>
                          )}

                          {/* File List */}
                          {fileUploads.practiceFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">
                                  Uploaded Files ({fileUploads.practiceFiles.length})
                                </h4>
                                <button
                                  onClick={clearAllPracticeFiles}
                                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                                >
                                  Clear All
                                </button>
                              </div>
                              {fileUploads.practiceFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="w-4 h-4 text-green-500" />
                                    <div>
                                      <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                                      <p className="text-xs text-gray-500">
                                        {(file.size / (1024 * 1024)).toFixed(2)}MB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeFile('practiceFiles', index)}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-4">
                          <button 
                            onClick={() => document.getElementById('practice-files-upload').click()}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Add More Files
                          </button>
                          <button 
                            onClick={clearAllPracticeFiles}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learners' && (
                <div className="w-full">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Assign Learners</h2>
                    <p className="text-gray-600">Select learners to enroll in this course</p>
                  </div>
                  
                  <div className="w-full space-y-6">
                    {/* Course Summary Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{courseDetails.title || 'Course Title'}</h3>
                            <p className="text-sm text-gray-600">
                              {courseDetails.department} • {courseDetails.level} • {courseDetails.estimatedDuration}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Ready to assign learners</p>
                          {learnersLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <p className="text-lg font-semibold text-blue-600">Loading learners...</p>
                            </div>
                          ) : (
                            <p className="text-lg font-semibold text-blue-600">{availableLearners?.length || 0} learners available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search learners by name, department, or experience level..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Departments</option>
                          {getUniqueDepartments().map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        <select
                          value={filterLevel}
                          onChange={(e) => setFilterLevel(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Levels</option>
                          {getUniqueLevels().map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            setSearchTerm('')
                            setFilterDepartment('')
                            setFilterLevel('')
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Learners Grid */}
                    {learnersLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading learners...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getSortedLearners(getFilteredLearners()).map((learner) => (
                        <div key={learner.id} className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
                          assignedLearners.includes(learner.id) 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`} onClick={() => toggleLearnerAssignment(learner.id)}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {learner.first_name} {learner.last_name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {learner.department || 'Not specified'} • {learner.experience_level}
                                </p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={assignedLearners.includes(learner.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                toggleLearnerAssignment(learner.id)
                              }}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 transition-colors"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-1">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {learner.department || 'General'}
                              </span>
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                {learner.experience_level}
                              </span>
                            </div>
                            <span className={`text-xs font-medium ${
                              assignedLearners.includes(learner.id) 
                                ? 'text-green-600' 
                                : 'text-gray-400'
                            }`}>
                              {assignedLearners.includes(learner.id) ? 'Selected' : 'Not Selected'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    )}

                    {/* Empty State */}
                    {!learnersLoading && getFilteredLearners().length === 0 && (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">
                          {(availableLearners?.length || 0) === 0 
                            ? 'No learners available for assignment' 
                            : 'No learners match your search criteria'
                          }
                        </p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
                      </div>
                    )}

                    {/* Selection Summary */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Learner Assignment Summary</h3>
                            <p className="text-sm text-gray-500">
                              {assignedLearners.length} of {availableLearners?.length || 0} learners selected
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={selectAllLearners}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Select All
                          </button>
                          <button
                            onClick={clearAllSelections}
                            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      
                      {assignedLearners.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{assignedLearners.length}</p>
                              <p className="text-sm text-gray-600">Learners Selected</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">
                                {Math.round((assignedLearners.length / (availableLearners?.length || 1)) * 100)}%
                              </p>
                              <p className="text-sm text-gray-600">Coverage Rate</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">
                                {(availableLearners?.length || 0) - assignedLearners.length}
                              </p>
                              <p className="text-sm text-gray-600">Remaining</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {assignedLearners.length === 0 && (
                        <div className="text-center py-6">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 mb-2">No learners selected yet</p>
                          <p className="text-sm text-gray-400">Select learners from the grid above to assign them to this course</p>
                        </div>
                      )}
                    </div>

                    {/* Ready to Publish Message */}
                    {assignedLearners.length > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Publish Course!</h3>
                            <p className="text-sm text-gray-600">
                              Your course "{courseDetails.title}" is ready with {assignedLearners.length} learners assigned. 
                              Click "Publish Course" to make it live.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 shadow-lg">
            {/* Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Send className="w-5 h-5 mr-2 text-blue-600" />
                Actions
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    if (activeTab === 'files') setActiveTab('details')
                    else if (activeTab === 'learners') setActiveTab('files')
                    else navigate('/courses')
                  }}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center font-medium transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                {activeTab === 'learners' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center justify-center font-semibold disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Publishing...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publish Course
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (activeTab === 'details') {
                        if (validateForm()) {
                          setActiveTab('files')
                        } else {
                          alert('Please fill in all required fields before continuing.')
                        }
                      } else if (activeTab === 'files') {
                        if (validateStep2()) {
                          setActiveTab('learners')
                        } else {
                          // Check for specific validation errors
                          const hasValidationErrors = Object.values(fileValidation).some(validation => !validation.isValid)
                          if (hasValidationErrors) {
                            const errorMessages = Object.values(fileValidation)
                              .filter(validation => !validation.isValid)
                              .map(validation => validation.message)
                              .join(', ')
                            alert(`File validation errors: ${errorMessages}`)
                          } else {
                            alert('Please upload at least one file (module files or practice files) before continuing.')
                          }
                        }
                      }
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center justify-center font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue
                  </button>
                )}
              </div>
            </div>

            {/* Simple Progress Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Configuration Status</h3>
                <span className="text-sm text-gray-500">
                  {Object.values(status).filter(s => s === 'Added' || s === 'Uploaded' || s === 'Assigned').length}/3 complete
                </span>
              </div>
              
              <div className="space-y-4">
                {/* Course Details */}
                <div className="relative p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status.details === 'Added' ? 'bg-green-500' : 'bg-blue-100'
                    }`}>
                      <BookOpen className={`w-5 h-5 ${
                        status.details === 'Added' ? 'text-white' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Course Details</h4>
                      <p className="text-sm text-gray-500">
                        {status.details === 'Added' ? 'Basic information completed' : 'Add course title and description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    {status.details === 'Added' ? (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Files */}
                <div className="relative p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status.files === 'Uploaded' ? 'bg-green-500' : 'bg-purple-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        status.files === 'Uploaded' ? 'text-white' : 'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Course Files</h4>
                      <p className="text-sm text-gray-500">
                        {status.files === 'Uploaded' ? 'All files uploaded successfully' : 'Upload modules and practice files'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    {status.files === 'Uploaded' ? (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Learners */}
                <div className="relative p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status.learners === 'Assigned' ? 'bg-green-500' : 'bg-green-100'
                    }`}>
                      <Users className={`w-5 h-5 ${
                        status.learners === 'Assigned' ? 'text-white' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Learners</h4>
                      <p className="text-sm text-gray-500">
                        {status.learners === 'Assigned' ? 'Learners assigned to course' : 'Select learners to enroll'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    {status.learners === 'Assigned' ? (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-sm">Pending</span>
                      </div>
                    )}
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

export default AddCourse
