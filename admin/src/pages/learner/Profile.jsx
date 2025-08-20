import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  Calendar,
  Edit,
  Save,
  X
} from 'lucide-react'
import LearnerLayout from '../../components/learner/LearnerLayout'
import axios from 'axios'
import { API_CONFIG } from '../../config/api'

const LearnerProfile = () => {
  const [learner, setLearner] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    experienceLevel: ''
  })

  useEffect(() => {
    const checkAuth = () => {
      const learnerToken = localStorage.getItem('learnerToken')
      const learnerData = localStorage.getItem('learnerData')
      
      if (!learnerToken || !learnerData) {
        navigate('/learner/login')
        return
      }

      try {
        const parsedData = JSON.parse(learnerData)
        setLearner(parsedData)
        setFormData({
          firstName: parsedData.firstName || '',
          lastName: parsedData.lastName || '',
          email: parsedData.email || '',
          phone: parsedData.phone || '',
          department: parsedData.department || '',
          experienceLevel: parsedData.experienceLevel || ''
        })
        
        // Update browser tab title with learner ID
        document.title = `Learner Profile - ID: ${parsedData.id} | ayeLearn`
        
        setLoading(false)
      } catch (error) {
        console.error('Error parsing learner data:', error)
        navigate('/learner/login')
      }
    }

    checkAuth()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('learnerToken')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

              const response = await axios.put(`${API_CONFIG.ENDPOINTS.LEARNERS}/${learner.id}`, formData)
      
      if (response.data.success) {
        // Update local storage with new data
        const updatedLearner = { ...learner, ...formData }
        localStorage.setItem('learnerData', JSON.stringify(updatedLearner))
        setLearner(updatedLearner)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: learner.firstName || '',
      lastName: learner.lastName || '',
      email: learner.email || '',
      phone: learner.phone || '',
      department: learner.department || '',
      experienceLevel: learner.experienceLevel || ''
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <LearnerLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </LearnerLayout>
    )
  }

  return (
    <LearnerLayout>
      <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                  <p className="text-gray-600">Manage your account information</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg">
                    <div className="text-sm font-medium">Learner ID</div>
                    <div className="text-xl font-bold">{learner?.id}</div>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <User className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {learner?.firstName} {learner?.lastName}
                    </h3>
                                         <p className="text-gray-600">{learner?.email}</p>
                     <p className="text-sm text-gray-500 mt-2">
                      Member since {new Date(learner?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                  
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{learner?.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{learner?.lastName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{learner?.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{learner?.phone || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      {isEditing ? (
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Department</option>
                          <option value="IT">IT</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{learner?.department}</p>
                      )}
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level
                      </label>
                      {isEditing ? (
                        <select
                          name="experienceLevel"
                          value={formData.experienceLevel}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{learner?.experienceLevel}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LearnerLayout>
      )
    }

export default LearnerProfile
