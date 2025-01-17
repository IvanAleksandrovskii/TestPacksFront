// src/components/EditQuiz.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import QuestionForm from '../components/QuestionForm';
import { quizApi } from "../api/quizApi";

const EditQuiz = ({ creatorId }) => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const test = await quizApi.getTest(id, creatorId);
                setName(test.name);
                setDescription(test.description);
                setQuestions(test.questions || []);
            } catch (error) {
                console.error("Failed to fetch test", error);
            }
        };
        fetchTest();
    }, [id, creatorId]);

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const addAnswer = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answers.push({ text: "", score: 0 });
        setQuestions(updatedQuestions);
    };

    const updateAnswer = (qIdx, aIdx, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIdx].answers[aIdx][field] = value;
        setQuestions(updatedQuestions);
    };

    const removeAnswer = (qIdx, aIdx) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIdx].answers = updatedQuestions[qIdx].answers.filter(
            (_, i) => i !== aIdx
        );
        setQuestions(updatedQuestions);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const testData = {
                name,
                description,
                questions: questions.map(q => ({
                    question_text: q.question_text,
                    is_quiz_type: q.is_quiz_type ?? true,
                    answers: q.answers.map(a => ({
                        text: a.text,
                        score: Number(a.score)  // Ensure score is a number
                    }))
                }))
            };
            
            await quizApi.updateTest(id, testData, creatorId);
            navigate("/");
        } catch (error) {
            console.error("Failed to update test", error);
            // Optionally show error to user
        }
    };

    return (
        <div>
            <h1>Edit Test</h1>
            <div>
                <label>Test Name:</label>
                <br />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <label>Description:</label>
                <br />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <h2>Questions</h2>
            {questions.map((question, index) => (
                <QuestionForm
                    key={index}
                    question={question}
                    index={index}
                    updateQuestion={updateQuestion}
                    removeQuestion={removeQuestion}
                    addAnswer={addAnswer}
                    removeAnswer={removeAnswer}
                    updateAnswer={updateAnswer}
                />
            ))}

            <button onClick={handleSubmit}>Save Changes</button>
        </div>
    );
};

export default EditQuiz;
