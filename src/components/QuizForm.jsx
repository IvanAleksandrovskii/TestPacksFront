// src/components/QuizForm.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

import "../App.css";


// Настройки для чекбоксов
const checkboxStyle = {
    accentColor: '#2600ff', // Синий цвет для галочки
    width: '28px',
    height: '28px'
};


const QuizForm = ({
    initialName = '',
    initialDescription = '',
    initialQuestions = [{
        question_text: '',
        answers: [],
        isTestFormat: false
    }],
    onSubmit,
    allowBackOption = false,
    initialAllowBack = true,
    buttonText = 'Save',  // Unused
    isSubmitting = false
}) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [allowBack, setAllowBack] = useState(initialAllowBack);
    const [questions, setQuestions] = useState(initialQuestions);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Рефы для скролла
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);

    // Для вопросов создадим массив refs
    const [questionRefs, setQuestionRefs] = useState([]);

    // При изменении кол-ва вопросов перестраиваем refs
    useEffect(() => {
        setQuestionRefs((prev) => {
            // Создаем новый массив refs:
            const newRefs = questions.map((_, i) => prev[i] || React.createRef());
            return newRefs;
        });
    }, [questions]);

    useEffect(() => {
        if (!isInitialized) {
            setName(initialName);
            setDescription(initialDescription);
            setAllowBack(initialAllowBack);
            setQuestions(initialQuestions.length > 0 ? initialQuestions.map(q => ({
                ...q,
                isTestFormat: q.answers.length > 0
            })) : [{
                question_text: '',
                answers: [],
                isTestFormat: false
            }]);
            setIsInitialized(true);
        }
    }, [initialName, initialDescription, initialAllowBack, initialQuestions, isInitialized]);

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Теруется ввести название теста';
        }

        if (!description.trim()) {
            newErrors.description = 'Теруется ввести описание теста';
        }

        const questionErrors = questions.map(question => {
            const qError = {};

            if (!question.question_text.trim()) {
                qError.question_text = 'Теруется ввести текст вопроса';
            }

            if (question.isTestFormat && question.answers.some(ans => !ans.text.trim())) {
                qError.answers = 'Теруется ввести текст ответа';
            }

            return Object.keys(qError).length > 0 ? qError : null;
        });

        if (questionErrors.some(e => e !== null)) {
            newErrors.questions = questionErrors;
        }

        return newErrors;
    };

    const handleSubmit = async () => {

        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

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
            // Ошибок нет — вызываем onSubmit
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
        } else {
            // Если есть ошибки — определяем, что именно не валидно
            if (validationErrors.name) {
                // Скроллим к полю Name
                nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                return; // Выходим
            }
            if (validationErrors.description) {
                // Скроллим к полю Description
                descriptionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
            if (validationErrors.questions) {
                // Находим индекс первого вопроса с ошибкой
                const firstQErrorIndex = validationErrors.questions.findIndex(q => q != null);
                if (firstQErrorIndex !== -1) {
                    // Скроллим к этому вопросу
                    questionRefs[firstQErrorIndex].current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        }
    };

    const handleTestFormatChange = (qIndex, isChecked) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].isTestFormat = isChecked;

        if (isChecked) {
            // Если включаем тестовый формат, добавляем один пустой ответ
            updatedQuestions[qIndex].answers = [{ text: '', score: 0 }];
        } else {
            // Если выключаем, удаляем все ответы
            updatedQuestions[qIndex].answers = [];
        }

        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: '',
                answers: [],
                isTestFormat: false
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
                    <div ref={nameRef /* Привязываем ref */}>
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium">Название:</label>
                            <p className="text-gray-500 text-[12px] mb-1">
                                Отображается для пользователей
                            </p>
                        </div>

                        <input
                            type="text"
                            style={{ color: 'black' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => setTouched({ ...touched, name: true })}
                            className={`w-full p-2 border rounded ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Введите название теста"
                        />
                        <ErrorMessage message={touched.name && errors.name} />
                    </div>
                </div>

                <div>
                    <div ref={descriptionRef /* Привязываем ref */}>
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium">Описание:</label>
                            <p className="text-gray-500 text-[12px] mb-1">
                                Отображается для пользователей
                            </p>
                        </div>
                        <textarea
                            value={description}
                            style={{ color: 'black' }}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => setTouched({ ...touched, description: true })}
                            className={`w-full p-2 border rounded ${touched.description && errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Введите описание теста"
                        />
                        <ErrorMessage message={touched.description && errors.description} />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Вопросы</h2>
                    {questions.map((question, qIndex) => (
                        <div
                            key={qIndex}
                            ref={questionRefs[qIndex]}
                            className={`p-4 border rounded ${touched.questions?.[qIndex] && errors.questions?.[qIndex]
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Вопрос {qIndex + 1}:</label>
                                    <textarea
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
                                        rows={3}
                                        placeholder="Введите текст вопроса"
                                    />
                                    <ErrorMessage
                                        message={touched.questions?.[qIndex]?.question_text && errors.questions?.[qIndex]?.question_text}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={question.isTestFormat}
                                                onChange={(e) => handleTestFormatChange(qIndex, e.target.checked)}
                                                className="rounded"
                                                style={checkboxStyle}
                                            />
                                            <span className="text-sm font-medium">Добавить варианты ответов с баллами</span>
                                        </label>
                                    </div>

                                    {questions.length <= 1 && question.isTestFormat && (
                                        <div className="text-sm text-gray-600 mt-6 mb-6 underline">
                                            <em>
                                                <p>
                                                    В одном тесте можно создавать разные типы вопросов и ответов. При добавлении вариантов ответов,
                                                    итоговый балл считается как сумма всех баллов, набранных при прохождении теста.
                                                    Если подсчет баллов не нужен, оставьте 0.
                                                </p>
                                            </em>
                                        </div>
                                    )}

                                    {questions.length <= 1 && !question.isTestFormat && (
                                        <div className="text-sm text-gray-600 mt-6 mb-6 underline">
                                            <em>
                                                <p>
                                                    Если вопрос открытый (без добавления ответов),
                                                    пользователь отвечает чат-боту в свободной форме.
                                                    Такие ответы не оцениваются и не включаются в итоговый подсчет баллов.
                                                </p>
                                            </em>
                                        </div>
                                    )}

                                    {question.answers.map((answer, aIndex) => (
                                        <div
                                            key={aIndex}
                                            className="flex flex-wrap items-center gap-2 mt-2"
                                        >
                                            <input
                                                type="text"
                                                style={{ color: 'black' }}
                                                value={answer.text}
                                                onChange={(e) => {
                                                    const updated = [...questions];
                                                    updated[qIndex].answers[aIndex].text = e.target.value;
                                                    setQuestions(updated);
                                                }}
                                                className="flex-1 p-2 border rounded min-w-[150px]"
                                                placeholder="Текст ответа"
                                            />
                                            <input
                                                type="number"
                                                style={{
                                                    color: 'black',
                                                    width: '60px' // подбирайте подходящее значение
                                                }}
                                                value={answer.score}
                                                onChange={(e) => {
                                                    const updated = [...questions];
                                                    updated[qIndex].answers[aIndex].score = e.target.value;
                                                    setQuestions(updated);
                                                }}
                                                className="p-2 border rounded"
                                                placeholder="Балл"
                                                title="Введите балл за ответ"
                                            />
                                            {!(question.isTestFormat && question.answers.length === 1) && (
                                                <button
                                                    onClick={() => {
                                                        const updated = [...questions];
                                                        updated[qIndex].answers = updated[qIndex].answers.filter((_, i) => i !== aIndex);
                                                        setQuestions(updated);
                                                    }}
                                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                    aria-label="Remove answer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}

                                        </div>
                                    ))}
                                    {errors.questions?.[qIndex]?.answers && (
                                        <ErrorMessage message={errors.questions[qIndex].answers} />
                                    )}
                                    {question.isTestFormat && question.answers.length < 6 && (
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => {
                                                    const updatedQuestions = [...questions];
                                                    updatedQuestions[qIndex].answers.push({ text: '', score: 0 });
                                                    setQuestions(updatedQuestions);
                                                }}
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 col-span-2"
                                            >
                                                Добавить ответ
                                            </button>
                                        </div>
                                    )}
                                    {questions.length > 1 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => removeQuestion(qIndex)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 col-span-2 mt-2"
                                            >
                                                Удалить вопрос
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {allowBackOption && (
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={allowBack}
                                onChange={(e) => setAllowBack(e.target.checked)}
                                className="rounded"
                                style={checkboxStyle}
                            />
                            <span className="text-sm font-medium">Разрешить пользователю возврат к предыдущему вопросу</span>
                        </label>
                    </div>
                )}
                <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Сохранение...' : buttonText}
                    </button>
                    <button
                        onClick={addQuestion}
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Добавить вопрос
                    </button>
                </div>
            </div>

        </div>
    );
};

export default QuizForm;