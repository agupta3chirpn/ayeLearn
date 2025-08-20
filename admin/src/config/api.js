// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Admin endpoints
    ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
    ADMIN_PROFILE: `${API_BASE_URL}/api/admin/profile`,
    ADMIN_PROFILE_UPLOAD_IMAGE: `${API_BASE_URL}/api/admin/profile/upload-image`,
    ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
    ADMIN_FORGOT_PASSWORD: `${API_BASE_URL}/api/admin/forgot-password`,
    ADMIN_RESET_PASSWORD: `${API_BASE_URL}/api/admin/reset-password`,
    ADMIN_DASHBOARD_STATS: `${API_BASE_URL}/api/admin/dashboard-stats`,
    
    // Learner endpoints
    LEARNERS: `${API_BASE_URL}/api/learners`,
    LEARNER_LOGIN: `${API_BASE_URL}/api/learners/login`,
    LEARNER_FORGOT_PASSWORD: `${API_BASE_URL}/api/learners/forgot-password`,
    LEARNER_UPLOAD_IMAGE: `${API_BASE_URL}/api/learners/upload-image`,
    LEARNER_COURSES: `${API_BASE_URL}/api/learners`,
    
    // Course endpoints
    COURSES: `${API_BASE_URL}/api/courses`,
    UPLOAD_COURSE_FILE: `${API_BASE_URL}/api/courses/upload-course-file`,
    
    // Department endpoints
    DEPARTMENTS: `${API_BASE_URL}/api/departments`,
    
    // Experience Level endpoints
    EXPERIENCE_LEVELS: `${API_BASE_URL}/api/experience-levels`,
  }
}

export default API_CONFIG
