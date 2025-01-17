// src/pages/EditQuiz.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import QuestionForm from '../components/QuestionForm';
import QuizForm from "../components/QuizForm";
import { quizApi } from "../api/quizApi";


const EditQuiz = ({ creatorId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const test = await quizApi.getTest(id, creatorId);
                setInitialData(test);
            } catch (error) {
                console.error("Failed to fetch test", error);
            }
        };
        fetchTest();
    }, [id, creatorId]);

    const handleSubmit = async (formData) => {
        try {
            await quizApi.updateTest(id, formData, creatorId);
            navigate("/");
        } catch (error) {
            console.error("Failed to update test", error);
            alert('Failed to update test. Check the console for details.');
        }
    };

    if (!initialData) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6" style={{ textAlign: 'center' }}>Edit Test</h1>
            <QuizForm
                initialName={initialData.name}
                initialDescription={initialData.description}
                initialAllowBack={initialData.allow_back}
                onSubmit={handleSubmit}
                buttonText="Save Changes"
            />
        </div>
    );
};

export default EditQuiz;