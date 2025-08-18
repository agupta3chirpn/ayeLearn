import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { API_CONFIG } from '../config/api';

const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`);
      if (response.data.success) {
                 setFormData({
           name: response.data.data.name,
           status: response.data.data.status || 'active'
         });
      }
    } catch (error) {
      setSubmitError('Failed to fetch department details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setErrors({});

    try {
      const response = await axios.put(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, formData);
      
      if (response.data.success) {
        navigate('/departments');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.path] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        setSubmitError(error.response?.data?.message || 'Failed to update department');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
                         <div className="container mx-auto">
               <div className="max-w-full mx-auto">
                 {/* Header */}
                 <div className="mb-8">
                   <h1 className="text-3xl font-bold text-gray-900">Edit Department</h1>
                   <p className="text-gray-600 mt-2">Update department information</p>
                 </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  {submitError && (
                    <div className="mb-6 p-4 border border-red-200 text-red-700 rounded-lg">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Department Name */}
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Department Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter department name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                                         {/* Status */}
                     <div className="mb-6">
                       <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                         Status *
                       </label>
                       <select
                         id="status"
                         name="status"
                         value={formData.status}
                         onChange={handleInputChange}
                         className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                           errors.status ? 'border-red-300' : 'border-gray-300'
                         }`}
                       >
                         <option value="active">Active</option>
                         <option value="inactive">Inactive</option>
                       </select>
                       {errors.status && (
                         <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                       )}
                     </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => navigate('/departments')}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }} 
                        onMouseEnter={(e) => !submitting && (e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)')} 
                        onMouseLeave={(e) => !submitting && (e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)')}
                      >
                        {submitting ? 'Updating...' : 'Update Department'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditDepartment;
