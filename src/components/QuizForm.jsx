import React, { useState, useEffect } from 'react';

const QuizForm = ({
    initialName = '',
    initialDescription = '',
    initialQuestions = [{
        question_text: '',
        answers: []
    }],
    onSubmit,
    allowBackOption = false,
    initialAllowBack = true,
    buttonText = 'Save'
}) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [allowBack, setAllowBack] = useState(initialAllowBack);
    const [questions, setQuestions] = useState(initialQuestions);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Update form only once when component mounts or when initial values change significantly
    useEffect(() => {
        if (!isInitialized) {
            setName(initialName);
            setDescription(initialDescription);
            setAllowBack(initialAllowBack);
            setQuestions(initialQuestions.length > 0 ? initialQuestions : [{
                question_text: '',
                answers: []
            }]);
            setIsInitialized(true);
        }
    }, [initialName, initialDescription, initialAllowBack, initialQuestions, isInitialized]);

    // Rest of your component code remains the same...
    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Test name is required';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        const questionErrors = questions.map(question => {
            const qError = {};

            if (!question.question_text.trim()) {
                qError.question_text = 'Question text is required';
            }

            return Object.keys(qError).length > 0 ? qError : null;
        });

        if (questionErrors.some(e => e !== null)) {
            newErrors.questions = questionErrors;
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const allTouched = {
            name: true,
            description: true,
            questions: questions.map(() => ({
                question_text: true,
                answers: true
            }))
        };
        setTouched(allTouched);

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            await onSubmit({
                name,
                description,
                allow_back: allowBack,
                questions: questions.map(q => ({
                    question_text: q.question_text,
                    answers: q.answers.map(a => ({
                        text: a.text,
                        score: Number(a.score)
                    }))
                }))
            });
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: '',
                answers: [],
            },
        ]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const ErrorMessage = ({ message }) => (
        message ? (
            <div className="text-red-500 text-sm mt-1">
                {message}
            </div>
        ) : null
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Test Name:</label>
                    <input
                        type="text"
                        style={{ color: 'black' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched({ ...touched, name: true })}
                        className={`w-full p-2 border rounded ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <ErrorMessage message={touched.name && errors.name} />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description:</label>
                    <textarea
                        value={description}
                        style={{ color: 'black' }}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => setTouched({ ...touched, description: true })}
                        className={`w-full p-2 border rounded ${touched.description && errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <ErrorMessage message={touched.description && errors.description} />
                </div>

                {allowBackOption && (
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={allowBack}
                                onChange={(e) => setAllowBack(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Allow going back to previous questions</span>
                        </label>
                    </div>
                )}

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Questions</h2>
                    {questions.map((question, qIndex) => (
                        <div
                            key={qIndex}
                            className={`p-4 border rounded ${touched.questions?.[qIndex] && errors.questions?.[qIndex]
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Question {qIndex + 1}:</label>
                                    <input
                                        type="text"
                                        style={{ color: 'black' }}
                                        value={question.question_text}
                                        onChange={(e) => {
                                            const updatedQuestions = [...questions];
                                            updatedQuestions[qIndex].question_text = e.target.value;
                                            setQuestions(updatedQuestions);
                                        }}
                                        onBlur={() => {
                                            const newTouched = { ...touched };
                                            if (!newTouched.questions) newTouched.questions = [];
                                            if (!newTouched.questions[qIndex]) newTouched.questions[qIndex] = {};
                                            newTouched.questions[qIndex].question_text = true;
                                            setTouched(newTouched);
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                    <ErrorMessage
                                        message={touched.questions?.[qIndex]?.question_text && errors.questions?.[qIndex]?.question_text}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Answers:</label>
                                    {question.answers.map((answer, aIndex) => (
                                        <div key={aIndex} className="flex space-x-2 mt-2">
                                            <input
                                                type="text"
                                                style={{ color: 'black' }}
                                                value={answer.text}
                                                onChange={(e) => {
                                                    const updatedQuestions = [...questions];
                                                    updatedQuestions[qIndex].answers[aIndex].text = e.target.value;
                                                    setQuestions(updatedQuestions);
                                                }}
                                                className="flex-1 p-2 border rounded"
                                                placeholder="Answer text"
                                            />
                                            <input
                                                type="number"
                                                style={{ color: 'black' }}
                                                value={answer.score}
                                                onChange={(e) => {
                                                    const updatedQuestions = [...questions];
                                                    updatedQuestions[qIndex].answers[aIndex].score = e.target.value;
                                                    setQuestions(updatedQuestions);
                                                }}
                                                className="w-20 p-2 border rounded"
                                                placeholder="Score"
                                            />
                                            <button
                                                onClick={() => {
                                                    const updatedQuestions = [...questions];
                                                    updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter(
                                                        (_, i) => i !== aIndex
                                                    );
                                                    setQuestions(updatedQuestions);
                                                }}
                                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    {errors.questions?.[qIndex]?.answers && (
                                        <ErrorMessage message={errors.questions[qIndex].answers} />
                                    )}
                                    {question.answers.length < 6 && (
                                        <button
                                            onClick={() => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[qIndex].answers.push({ text: '', score: 0 });
                                                setQuestions(updatedQuestions);
                                            }}
                                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Add Answer
                                        </button>
                                    )}
                                </div>

                                {questions.length > 1 && (
                                    <button
                                        onClick={() => removeQuestion(qIndex)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove Question
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-x-4">
                    <button
                        onClick={addQuestion}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Question
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default QuizForm;