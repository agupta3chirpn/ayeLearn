import { Navigate } from 'react-router-dom'

const LearnerPrivateRoute = ({ children }) => {
  const learnerToken = localStorage.getItem('learnerToken')
  const learnerData = localStorage.getItem('learnerData')

  if (!learnerToken || !learnerData) {
    return <Navigate to="/learner/login" replace />
  }

  try {
    // Verify that learnerData is valid JSON
    JSON.parse(learnerData)
    return children
  } catch (error) {
    // If learnerData is not valid JSON, redirect to login
    localStorage.removeItem('learnerToken')
    localStorage.removeItem('learnerData')
    return <Navigate to="/learner/login" replace />
  }
}

export default LearnerPrivateRoute
