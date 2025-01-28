// src/pages/CreateQuiz.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { quizApi } from '../api/quizApi';
import QuizForm from '../components/QuizForm';


const CreateQuiz = ({ tgUser }) => {
    const navigate = useNavigate();

    // Добавляем обработку кнопки назад
    useEffect(() => {
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.onClick(() => {
                navigate('/tests');
            });
        }
    }, [navigate]);

    const handleSubmit = async (formData) => {
        try {
            const response = await quizApi.createTest({
                ...formData,
                creator_id: parseInt(tgUser?.id)
            });
            // alert(`Test created with ID: ${response.id}`);
            navigate("/tests");
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
