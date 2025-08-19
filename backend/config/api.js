// API Configuration for Backend
const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
}

module.exports = API_CONFIG
