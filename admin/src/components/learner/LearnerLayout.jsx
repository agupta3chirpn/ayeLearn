import LearnerHeader from './LearnerHeader'
import LearnerSidebar from './LearnerSidebar'
import LearnerFooter from './LearnerFooter'

const LearnerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LearnerHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <LearnerSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      
      <LearnerFooter />
    </div>
  )
}

export default LearnerLayout
