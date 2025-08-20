import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import LearnerPrivateRoute from './components/LearnerPrivateRoute'
// Admin Module Imports
import Login from './pages/admin/Login'
import ForgotPassword from './pages/admin/ForgotPassword'
import ResetPassword from './pages/admin/ResetPassword'
import Dashboard from './pages/admin/Dashboard'
import Profile from './pages/admin/Profile'
import Learners from './pages/admin/Learners'
import AddLearner from './pages/admin/AddLearner'
import EditLearner from './pages/admin/EditLearner'
import Courses from './pages/admin/Courses'
import AddCourse from './pages/admin/AddCourse'
import EditCourse from './pages/admin/EditCourse'
import CourseDetails from './pages/admin/CourseDetails'
import Departments from './pages/admin/Departments'
import AddDepartment from './pages/admin/AddDepartment'
import EditDepartment from './pages/admin/EditDepartment'
import ExperienceLevels from './pages/admin/ExperienceLevels'
import AddExperienceLevel from './pages/admin/AddExperienceLevel'
import EditExperienceLevel from './pages/admin/EditExperienceLevel'
// Learner Module Imports
import LearnerLogin from './pages/learner/Login'
import LearnerDashboard from './pages/learner/Dashboard'
import LearnerProfile from './pages/learner/Profile'
import LearnerCourses from './pages/learner/Courses'
import LearnerForgotPassword from './pages/learner/ForgotPassword'


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password/:token" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/learners" 
            element={
              <PrivateRoute>
                <Learners />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/learners/add" 
            element={
              <PrivateRoute>
                <AddLearner />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/learners/edit/:id" 
            element={
              <PrivateRoute>
                <EditLearner />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/courses" 
            element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/courses/add" 
            element={
              <PrivateRoute>
                <AddCourse />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/edit-course/:id" 
            element={
              <PrivateRoute>
                <EditCourse />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/course/:id" 
            element={
              <PrivateRoute>
                <CourseDetails />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/departments" 
            element={
              <PrivateRoute>
                <Departments />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/departments/add" 
            element={
              <PrivateRoute>
                <AddDepartment />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/departments/edit/:id" 
            element={
              <PrivateRoute>
                <EditDepartment />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/experience-levels" 
            element={
              <PrivateRoute>
                <ExperienceLevels />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/experience-levels/add" 
            element={
              <PrivateRoute>
                <AddExperienceLevel />
              </PrivateRoute>
            } 
          />
                      <Route 
              path="/experience-levels/edit/:id" 
              element={
                <PrivateRoute>
                  <EditExperienceLevel />
                </PrivateRoute>
              } 
            />

          {/* Learner Module Routes */}
          <Route 
            path="/learner/login" 
            element={<LearnerLogin />}
          />
          <Route 
            path="/learner/forgot-password" 
            element={<LearnerForgotPassword />}
          />
          <Route 
            path="/learner/dashboard" 
            element={
              <LearnerPrivateRoute>
                <LearnerDashboard />
              </LearnerPrivateRoute>
            }
          />
          <Route 
            path="/learner/profile" 
            element={
              <LearnerPrivateRoute>
                <LearnerProfile />
              </LearnerPrivateRoute>
            }
          />
          <Route 
            path="/learner/courses" 
            element={
              <LearnerPrivateRoute>
                <LearnerCourses />
              </LearnerPrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
