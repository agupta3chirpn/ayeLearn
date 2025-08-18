import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { API_CONFIG } from '../config/api';

const AddDepartment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

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
    setLoading(true);
    setSubmitError('');
    setErrors({});

    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.DEPARTMENTS, formData);
      
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
        setSubmitError(error.response?.data?.message || 'Failed to create department');
      }
    } finally {
      setLoading(false);
    }
  };

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
                   <h1 className="text-3xl font-bold text-gray-900">Add Department</h1>
                   <p className="text-gray-600 mt-2">Create a new academic department</p>
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
                        disabled={loading}
                        className="px-6 py-2 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)' }} 
                        onMouseEnter={(e) => !loading && (e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)')} 
                        onMouseLeave={(e) => !loading && (e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)')}
                      >
                        {loading ? 'Creating...' : 'Create Department'}
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

export default AddDepartment;
