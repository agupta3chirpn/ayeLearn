// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Admin endpoints
    ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
    ADMIN_PROFILE: `${API_BASE_URL}/api/admin/profile`,
    ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
    
    // Learner endpoints
    LEARNERS: `${API_BASE_URL}/api/learners`,
    LEARNER_UPLOAD_IMAGE: `${API_BASE_URL}/api/learners/upload-image`,
    
    // Course endpoints
    COURSES: `${API_BASE_URL}/api/courses`,
    
    // Department endpoints
    DEPARTMENTS: `${API_BASE_URL}/api/departments`,
    
    // Experience Level endpoints
    EXPERIENCE_LEVELS: `${API_BASE_URL}/api/experience-levels`,
  }
}

export default API_CONFIG
