import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminFooter from './AdminFooter'

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      
      <AdminFooter />
    </div>
  )
}

export default AdminLayout
