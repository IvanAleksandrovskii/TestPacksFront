// src/components/LoadingSpinner.jsx

import React from "react";


const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
};

export default LoadingSpinner;
