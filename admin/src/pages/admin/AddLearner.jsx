import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building,
  TrendingUp,
  User,
  ChevronDown,
  Lock
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { API_CONFIG } from '../../config/api'
import ConfirmPopup from '../../components/shared/ConfirmPopup'

const AddLearner = () => {
  const { logout } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: 'Male',
    email: '',
    phone: '',
    department: '',
    experienceLevel: '',
    status: 'active',
    password: '',
    confirmPassword: ''
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [departments, setDepartments] = useState([])
  const [experienceLevels, setExperienceLevels] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // Fetch departments and experience levels
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const departmentsResponse = await axios.get(API_CONFIG.ENDPOINTS.DEPARTMENTS)
        if (departmentsResponse.data.success) {
          // Filter only active departments
          const activeDepartments = departmentsResponse.data.data
            .filter(dept => dept.status === 'active')
            .map(dept => dept.name)
          setDepartments(activeDepartments)
        }

        // Fetch experience levels
        const experienceLevelsResponse = await axios.get(API_CONFIG.ENDPOINTS.EXPERIENCE_LEVELS)
        if (experienceLevelsResponse.data.success) {
          // Filter only active experience levels
          const activeExperienceLevels = experienceLevelsResponse.data.data
            .filter(level => level.status === 'active')
            .map(level => level.name)
          setExperienceLevels(activeExperienceLevels)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Set default values if API fails
        setDepartments(['Medical Sciences', 'Computer Science', 'Engineering'])
        setExperienceLevels(['Beginner', 'Intermediate', 'Advanced'])
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [])



  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setSubmitError('')
  }

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setErrors(prev => ({ ...prev, image: '' }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!selectedImage) return null

    try {
      const formData = new FormData()
      formData.append('avatar', selectedImage)

      const response = await axios.post(API_CONFIG.ENDPOINTS.LEARNER_UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        return response.data.imagePath
      } else {
        throw new Error(response.data.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')
    
    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters long' }))
      setLoading(false)
      return
    }
    
    try {
      // Upload image first if selected
      let avatarUrl = null
      if (selectedImage) {
        avatarUrl = await uploadImage()
        if (!avatarUrl) {
          setLoading(false)
          return
        }
      }

      // Format date for submission
      const formattedDate = formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''

      // Prepare form data with image URL
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formattedDate,
        gender: formData.gender,
        department: formData.department,
        experience_level: formData.experienceLevel,
        status: formData.status,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }

      const response = await axios.post(API_CONFIG.ENDPOINTS.LEARNERS, submitData)

      if (response.data.success) {
        setSuccess(true)
        setShowSuccessPopup(true)
      } else {
        // Handle server-side validation errors
        if (response.data.errors && Array.isArray(response.data.errors)) {
          const fieldErrors = {}
          response.data.errors.forEach(error => {
            const fieldName = error.path || error.param
            if (fieldName) {
              // Map backend field names to frontend field names
              const fieldMap = {
                'first_name': 'firstName',
                'last_name': 'lastName',
                'date_of_birth': 'dateOfBirth',
                'experience_level': 'experienceLevel',
                'status': 'status'
              }
              const frontendField = fieldMap[fieldName] || fieldName
              fieldErrors[frontendField] = error.msg
            }
          })
          setErrors(fieldErrors)
          
          // Scroll to first error field
          const firstErrorField = Object.keys(fieldErrors)[0]
          if (firstErrorField) {
            const element = document.querySelector(`[name="${firstErrorField}"]`)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              element.focus()
            }
          }
        } else {
          setSubmitError(response.data.message || 'Failed to add learner')
        }
      }
    } catch (error) {
      console.error('Error adding learner:', error)
      
      if (error.response?.data?.errors) {
        const fieldErrors = {}
        error.response.data.errors.forEach(error => {
          const fieldName = error.path || error.param
          if (fieldName) {
            // Map backend field names to frontend field names
            const fieldMap = {
              'first_name': 'firstName',
              'last_name': 'lastName',
              'date_of_birth': 'dateOfBirth',
              'experience_level': 'experienceLevel',
              'status': 'status'
            }
            const frontendField = fieldMap[fieldName] || fieldName
            fieldErrors[frontendField] = error.msg
          }
        })
        setErrors(fieldErrors)
        
        // Scroll to first error field
        const firstErrorField = Object.keys(fieldErrors)[0]
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.focus()
          }
        }
      } else {
        setSubmitError(error.response?.data?.message || 'Failed to add learner. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }



  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-6">
            {/* Breadcrumbs */}
            <div className="mb-6">
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
                      <Link to="/learners" className="text-gray-700 hover:text-gray-900">
                        Learners
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="mx-2 text-gray-400">/</span>
                      <span className="text-gray-500">Add New Learner</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>

            {/* Form */}
            <div className="w-full mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Add New Learner</h2>
                      <p className="text-gray-600">Fill in the details below to create a new learner account</p>
                    </div>
                  </div>
                </div>


                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">Learner added successfully! Redirecting...</p>
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800 font-medium">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {dataLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading form data...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name*
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter first name"
                          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        />
                        {errors.firstName && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.firstName}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter last name"
                          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        />
                        {errors.lastName && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.lastName}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth*
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.dateOfBirth}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            maxDate={new Date()}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            placeholderText="Select date of birth"
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.dateOfBirth ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.dateOfBirth && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.dateOfBirth}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender*
                        </label>
                        <div className="flex space-x-6 pt-2.5">
                          {['Male', 'Female', 'Other'].map((gender) => (
                            <label key={gender} className="flex items-center">
                              <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={formData.gender === gender}
                                onChange={handleInputChange}
                                className="mr-2 w-5 h-5 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                style={{ 
                                  accentColor: '#085EB4',
                                  transform: 'scale(1.3)'
                                }}
                              />
                              <span className="text-sm text-gray-700">{gender}</span>
                            </label>
                          ))}
                        </div>
                        {errors.gender && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.gender}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Profile Image</h3>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Image (JPG, JPEG, PNG - Max 5MB)
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleImageChange}
                          className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium ${
                            errors.image ? 'file:bg-red-50 file:text-red-700' : 'file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100'
                          }`}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Recommended size: 200x200 pixels
                        </p>
                        {errors.image && (
                          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email*
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.email}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone*
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.phone}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          />
                        </div>
                        {errors.password && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.password}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm password"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.confirmPassword}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <Building className="w-4 h-4 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white ${
                              errors.department ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
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
                          Experience Level <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white ${
                              errors.experienceLevel ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <option value="">Select Experience Level</option>
                            {experienceLevels.map((level) => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.experienceLevel && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.experienceLevel}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                            <div className={`w-3 h-3 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          </div>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white ${
                              errors.status ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.status && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{errors.status}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200 bg-gray-50 -mx-8 -mb-8 px-8 py-6 rounded-b-xl">
                    <Link to="/learners">
                      <button
                        type="button"
                        className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }}
                      onMouseEnter={(e) => !loading && (e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)')}
                      onMouseLeave={(e) => !loading && (e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)')}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding Learner...
                        </div>
                      ) : (
                        'Add New Learner'
                      )}
                    </button>
                  </div>
                </form>
                )}
              </div>
            </div>
          </main>
      
      {/* Success Popup */}
      <ConfirmPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        onConfirm={() => window.location.href = '/learners'}
        title="Learner Added Successfully"
        message={`The learner "${formData.firstName} ${formData.lastName}" has been successfully added to the system. You will be redirected to the learners list in 5 seconds.`}
        type="success"
        autoClose={true}
        redirectAfter={() => window.location.href = '/learners'}
      />
    </AdminLayout>
  )
}

export default AddLearner
