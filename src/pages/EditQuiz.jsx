// src/pages/EditQuiz.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import QuizForm from "../components/QuizForm";
import { quizApi } from "../api/quizApi";


const EditQuiz = ({ creatorId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Добавляем обработку кнопки назад
    useEffect(() => {
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.onClick(() => {
                navigate('/tests');
            });
        }
    }, [navigate]);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const test = await quizApi.getTest(id, creatorId);
                setInitialData(test);
            } catch (error) {
                console.error("Failed to fetch test", error);
                setError("Failed to load test data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [id, creatorId]);

    const handleSubmit = async (formData) => {
        try {
            await quizApi.updateTest(id, formData, creatorId);
            navigate("/tests");
        } catch (error) {
            console.error("Failed to update test", error);
            alert('Failed to update test. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center text-gray-500 mt-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-8">{error}</div>;
    }

    if (!initialData) {
        return <div className="text-center text-gray-500 mt-8">Test not found</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Test</h1>
            <QuizForm
                initialName={initialData.name}
                initialDescription={initialData.description}
                initialAllowBack={initialData.allow_back}
                initialQuestions={initialData.questions.map(q => ({
                    question_text: q.question_text,
                    answers: q.answers.map(a => ({
                        text: a.text,
                        score: a.score
                    }))
                }))}
                onSubmit={handleSubmit}
                buttonText="Сохранить изменения"
                allowBackOption={true}
            />
        </div>
    );
};

export default EditQuiz;