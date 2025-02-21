// src/pages/CreateQuiz.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { quizApi } from '../api/quizApi';
import QuizForm from '../components/QuizForm';


const CreateQuiz = ({ tgUser }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await quizApi.createTest({
                ...formData,
                creator_id: parseInt(tgUser?.id)
            });
            navigate("/tests");
        } catch (error) {
            console.error('Error creating test:', error);
            alert('Произошла ошибка при создании теста. Попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6" style={{ textAlign: 'center' }}>Create Custom Test</h1>
            <QuizForm
                onSubmit={handleSubmit}
                allowBackOption={true}
                buttonText="Создать тест"
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default CreateQuiz;
