import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_CONFIG } from '../../config/api';
import ConfirmPopup from '../../components/shared/ConfirmPopup';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.DEPARTMENTS);
      setDepartments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to fetch departments');
      setLoading(false);
    }
  };

  const handleDelete = async (departmentId) => {
    try {
      await axios.delete(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${departmentId}`);
      setDepartments(departments.filter(dept => dept.id !== departmentId));
      setShowDeleteModal(false);
      setDepartmentToDelete(null);
      setSuccessMessage(`Department "${departmentToDelete?.name}" deleted successfully!`);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error deleting department:', error);
      alert(error.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (departmentToDelete) {
      handleDelete(departmentToDelete.id);
    }
  };

  const filteredAndSortedDepartments = departments
    .filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto">
                 {/* Header */}
         <div className="flex justify-between items-center mb-6">
           <div>
             <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
             <p className="text-gray-600 mt-2">Manage academic departments and their information</p>
           </div>
           <Link
             to="/departments/add"
             className="px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 flex items-center" 
             style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }} 
             onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'} 
             onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)'}
           >
             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
             </svg>
             Add Department
           </Link>
         </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="created_at">Created Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Departments List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredAndSortedDepartments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new department.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedDepartments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{department.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          department.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {department.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(department.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/departments/edit/${department.id}`}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-50"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(department)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Popup */}
        <ConfirmPopup
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDepartmentToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Department"
          message={`Are you sure you want to delete "${departmentToDelete?.name}"?\n\nThis action cannot be undone.`}
          type="confirm"
          confirmText="Delete"
          cancelText="Cancel"
        />

        {/* Success Popup */}
        <ConfirmPopup
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          title="Success"
          message={successMessage}
          type="success"
          autoClose={true}
          redirectAfter={() => navigate('/departments')}
        />
            </div>
          </main>
    </AdminLayout>
  );
};

export default Departments;
