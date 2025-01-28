// src/components/NavigationPanel.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, Package, Home } from 'lucide-react';

const NavigationPanel = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-t`}>
      <div className="flex justify-around w-full max-w-sm">
        <button
          onClick={() => navigate('/tests')}
          className={`flex flex-col items-center justify-center w-20 h-full ${
            location.pathname === '/tests'
              ? 'text-blue-600'
              : isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } hover:text-blue-400 transition-colors`}
        >
          <ClipboardList size={24} />
          <span className="text-xs mt-1">Тесты</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center w-20 h-full ${
            location.pathname === '/'
              ? 'text-blue-600'
              : isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } hover:text-blue-400 transition-colors`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          onClick={() => navigate('/test_packs')}
          className={`flex flex-col items-center justify-center w-20 h-full ${
            location.pathname === '/test_packs'
              ? 'text-blue-600'
              : isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } hover:text-blue-400 transition-colors`}
        >
          <Package size={24} />
          <span className="text-xs mt-1">Наборы</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationPanel;