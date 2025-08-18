import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Learners from './pages/Learners'
import AddLearner from './pages/AddLearner'
import EditLearner from './pages/EditLearner'
import Courses from './pages/Courses'
import AddCourse from './pages/AddCourse'
import Departments from './pages/Departments'
import AddDepartment from './pages/AddDepartment'
import EditDepartment from './pages/EditDepartment'
import ExperienceLevels from './pages/ExperienceLevels'
import AddExperienceLevel from './pages/AddExperienceLevel'
import EditExperienceLevel from './pages/EditExperienceLevel'


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

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
