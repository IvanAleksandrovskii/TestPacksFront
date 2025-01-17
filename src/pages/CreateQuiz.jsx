// src/pages/CreateQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import QuestionForm from '../components/QuestionForm';
import { quizApi } from '../api/quizApi';

const CreateQuiz = ({ tgUser }) => {
    const [testName, setTestName] = useState('');
    const [description, setDescription] = useState('');
    const [creatorId, setCreatorId] = useState('');
    const [allowBack, setAllowBack] = useState(true);
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (tgUser) {
            setCreatorId(tgUser.id);
        }
    }, [tgUser]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: '',
                is_quiz_type: false,
                answers: [],
            },
        ]);
    };

    const submitTest = async () => {
        const testPayload = {
            name: testName,
            description,
            creator_id: parseInt(creatorId),
            allow_back: allowBack,
            questions,
        };

        try {
            const response = await quizApi.createTest(testPayload);
            alert(`Test created with ID: ${response.id}`);
        } catch (error) {
            console.error('Error creating test:', error);
            alert('Failed to create test. Check the console for details.');
        }
        navigate("/");
    };

    return (
        <div>
            <h1>Create Custom Test</h1>

            <div style={{ marginBottom: '10px' }}>
                <label>Test Name:</label>
                <br />
                <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Description:</label>
                <br />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Allow Back:</label>
                <br />
                <input
                    type="checkbox"
                    checked={allowBack}
                    onChange={(e) => setAllowBack(e.target.checked)}
                />
            </div>

            <h2>Questions</h2>
            {questions.map((question, index) => (
                <QuestionForm
                    key={index}
                    question={question}
                    index={index}
                    updateQuestion={(idx, field, value) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[idx][field] = value;
                        setQuestions(updatedQuestions);
                    }}
                    removeQuestion={(idx) => setQuestions(questions.filter((_, i) => i !== idx))}
                    addAnswer={(idx) => {
                        const updatedQuestions = [...questions];
                        if (updatedQuestions[idx].answers.length < 6) {
                            updatedQuestions[idx].answers.push({ text: '', score: 0 });
                            setQuestions(updatedQuestions);
                        }
                    }}
                    removeAnswer={(qIdx, aIdx) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[qIdx].answers = updatedQuestions[qIdx].answers.filter(
                            (_, i) => i !== aIdx
                        );
                        setQuestions(updatedQuestions);
                    }}
                    updateAnswer={(qIdx, aIdx, field, value) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[qIdx].answers[aIdx][field] = value;
                        setQuestions(updatedQuestions);
                    }}
                />
            ))}

            <button onClick={addQuestion}>Add Question</button>
            <button onClick={submitTest} style={{ marginTop: '20px' }}>Submit Test</button>
        </div>
    );
};

export default CreateQuiz;
