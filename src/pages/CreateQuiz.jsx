// src/pages/CreateQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { quizApi } from '../api/quizApi';
import QuizForm from '../components/QuizForm';


const CreateQuiz = ({ tgUser }) => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            const response = await quizApi.createTest({
                ...formData,
                creator_id: parseInt(tgUser?.id)
            });
            // alert(`Test created with ID: ${response.id}`);
            navigate("/");
        } catch (error) {
            console.error('Error creating test:', error);
            alert('Failed to create test. An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6" style={{ textAlign: 'center' }}>Create Custom Test</h1>
            <QuizForm
                onSubmit={handleSubmit}
                allowBackOption={true}
                buttonText="Create Test"
            />
        </div>
    );
};

export default CreateQuiz;
