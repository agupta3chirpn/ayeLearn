import { useEffect } from 'react'
import { X, CheckCircle, AlertTriangle } from 'lucide-react'

const ConfirmPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'confirm', // 'confirm' or 'success'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  autoClose = false,
  redirectAfter = null
}) => {
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose()
        if (redirectAfter) {
          redirectAfter()
        }
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [autoClose, isOpen, onClose, redirectAfter])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {type === 'success' ? (
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              if (type === 'confirm') {
                onConfirm()
              } else {
                onClose()
                if (redirectAfter) {
                  redirectAfter()
                }
              }
            }}
            className="px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            style={{ 
              background: type === 'success' 
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)'
            }}
            onMouseEnter={(e) => {
              if (type === 'success') {
                e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              } else {
                e.target.style.background = 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'
              }
            }}
            onMouseLeave={(e) => {
              if (type === 'success') {
                e.target.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
              } else {
                e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)'
              }
            }}
          >
            {type === 'success' ? 'OK' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPopup
