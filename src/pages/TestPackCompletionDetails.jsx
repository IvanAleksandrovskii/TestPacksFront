import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { ChevronDown, ChevronUp, MessageSquare, Copy } from "lucide-react";

import { testPacksApi } from "../api/testPacksApi";

import AITranscriptionCard from "../components/AITranscriptionCard";


const PsychoTestCard = ({ test }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4 border rounded-lg shadow-sm bg-white text-black">
            {/* Заголовок карточки с переключателем */}
            <div
                className="p-4 border-b cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div>
                    <h3 className="text-lg font-semibold">{test.name}</h3>
                    <div className="text-sm text-gray-500">
                        Завершён: {format(normalizeDate(test.completed_at), "dd MMM yyyy HH:mm", { locale: ru })}
                    </div>
                </div>
                {/* Индикатор разворота */}
                <div className="text-gray-500 text-xl">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </div>

            {/* Содержимое, которое сворачивается/разворачивается */}
            {isOpen && (
                <div className="p-4">
                    <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                        {test.result}
                    </div>
                </div>
            )}
        </div>
    );
};


// Утилита для нормализации даты
const normalizeDate = (dateString) => {
    if (!dateString) return new Date();

    // Если строка даты не заканчивается на Z и не содержит +, добавляем UTC
    if (!dateString.endsWith('Z') && !dateString.includes('+')) {
        return new Date(dateString + '+00:00');
    }
    return new Date(dateString);
};


const CustomTestCard = ({ test }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4 border rounded-lg shadow-sm bg-white text-black">
            {/* Заголовок карточки с переключателем */}
            <div
                className="p-4 border-b cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div>
                    <h3 className="text-lg font-semibold">{test.name}</h3>
                    <div className="text-sm text-gray-500">
                        Завершён: {format(normalizeDate(test.completed_at), "dd MMM yyyy HH:mm", { locale: ru })}
                    </div>
                </div>
                {/* Индикатор разворота */}
                <div className="text-gray-500 text-xl">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </div>

            {/* Содержимое, которое сворачивается/разворачивается */}
            {isOpen && (
                <div className="p-4">
                    <div className="space-y-4">
                        {test.result.free_answers?.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Свободные ответы:</h4>
                                {test.result.free_answers.map((answer, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                                        <div className="font-medium text-sm">{answer.question_text}</div>
                                        <div className="text-sm mt-1">{answer.answer_text}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {format(normalizeDate(answer.timestamp), "dd MMM yyyy HH:mm:ss", { locale: ru })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {test.result.test_answers?.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Тестовые ответы:</h4>
                                {test.result.test_answers.map((answer, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                                        <div className="font-medium text-sm">{answer.question_text}</div>
                                        <div className="text-sm mt-1">{answer.answer_text}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="text-xs text-gray-500">
                                                {format(normalizeDate(answer.timestamp), "dd MMM yyyy HH:mm:ss", { locale: ru })}
                                            </div>
                                            {answer.score !== null && (
                                                <div className={`text-sm font-medium ${answer.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    Балл: {answer.score}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {test.result.score !== undefined && (
                            <div>
                                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                    <span className="font-medium">Итоговый балл:</span>
                                    <span className={`font-bold ${test.result.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {test.result.score}
                                    </span>
                                </div>
                                {/* {test.result.total_score !== undefined && (  // TODO: FIELD DELETED ON BACKEND
                                    <div className="flex justify-between p-3 pt-1 text-sm text-gray-500 mt-1">
                                        <span></span>
                                        <span className='underline italic'>максимум возможно: {test.result.total_score}</span>
                                    </div>
                                )} */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const renderValue = (value) => {
    return value === "Не указано" ? "" : value;
};

const TestPackCompletionDetails = ({ tgUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { completion, filters } = location.state || {};

    // Cостояния для разворачивания/сворачивания секций
    const [showPsychoTests, setShowPsychoTests] = useState(true);
    const [showCustomTests, setShowCustomTests] = useState(true);
    const [showPendingTests, setShowPendingTests] = useState(true);

    const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);

    const firstName = renderValue(completion.user_data.first_name);
    const lastName = renderValue(completion.user_data.last_name);
    const username = renderValue(completion.user_data.username);
    const phone = renderValue(completion.user_data.phone);

    const [aiTranscription, setAiTranscription] = useState(completion?.ai_transcription || null);

    useEffect(() => {
        const tg = window?.Telegram?.WebApp;

        if (tg) {
            // Показываем кнопку назад
            tg.BackButton.show();

            // Обработчик нажатия кнопки назад
            const handleBackButton = () => {
                navigate('/test-completions', {
                    state: {
                        activeTab: filters?.activeTab || '',
                        selectedTestPack: filters?.selectedTestPack || '',
                        currentPage: filters?.currentPage || 1,
                        pageSize: filters?.pageSize || 20
                    }
                });
            };

            // Подписываемся на событие
            tg.BackButton.onClick(handleBackButton);

            // Очистка при размонтировании
            return () => {
                tg.BackButton.offClick(handleBackButton);
                tg.BackButton.hide();
            };
        }
    }, [navigate, filters]);

    if (!completion) {
        return (
            <div className="p-4">
                <div className="text-center text-gray-500">Данные о прохождении не найдены</div>
            </div>
        );
    }

    const psychoTests = completion.completed_tests.filter(test => test.type === 'test');
    const customTests = completion.completed_tests.filter(test => test.type === 'custom');

    const handleCopyUsername = async (e) => {
        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(username);
            if (window.Telegram?.WebApp?.showPopup) {
                window.Telegram.WebApp.showPopup({
                    message: "Юзернейм скопирован в буфер обмена",
                    buttons: [{ type: "close" }],
                });
            } else {
                alert("Юзернейм скопирован в буфер обмена");
            }
        } catch (err) {
            console.error("Ошибка при копировании юзернейма:", err);
        }
        setUsernameModalOpen(false);
    };

    const handleOpenChat = (e) => {
        e.stopPropagation();
        if (username) {
            window.Telegram.WebApp.openTelegramLink(`https://t.me/${username}`);
        }
        setUsernameModalOpen(false);
    };

    const handleCopyPhone = async (e) => {
        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(phone);
            if (window.Telegram?.WebApp?.showPopup) {
                window.Telegram.WebApp.showPopup({
                    message: "Телефон скопирован в буфер обмена",
                    buttons: [{ type: "close" }],
                });
            } else {
                alert("Телефон скопирован в буфер обмена");
            }
        } catch (err) {
            console.error("Ошибка при копировании телефона:", err);
        }
    };

    const handleUsernameClick = (e) => {
        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

        e.stopPropagation();
        setUsernameModalOpen(true);
    };

    const handleClearAiTranscription = async () => {
        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

        try {
            await testPacksApi.clearAITranscription(tgUser.id, completion.id);
            if (window.Telegram?.WebApp?.showPopup) {
                window.Telegram.WebApp.showPopup({
                    message: "Информация о результатах удалена",
                    buttons: [{ type: "close" }],
                });
            } else {
                alert("Информация о результатах удалена");
            }
            setAiTranscription(null);
        } catch (err) {
            console.error("Ошибка при удалении информации о результатах:", err);
        }
    };

    const handleGetAiTranscription = async () => {
        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

        try {
            const data = await testPacksApi.getAITrancription(tgUser.id, completion.id);
            setAiTranscription(data);
        } catch (err) {
            console.error("Ошибка при получении информации ИИ расшифровки:", err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{completion.test_pack_name}</h1>
                <div className="flex gap-4 text-sm text-gray-600">
                    <span>Создан: {format(normalizeDate(completion.created_at), "dd MMM yyyy HH:mm", { locale: ru })}</span>
                    <span>•</span>
                    <span>Обновлён: {format(normalizeDate(completion.updated_at), "dd MMM yyyy HH:mm", { locale: ru })}</span>
                </div>
                <div className="mt-2">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${completion.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : completion.status === "ABANDONED"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                    >
                        {completion.status === "COMPLETED"
                            ? "Завершено"
                            : completion.status === "ABANDONED"
                                ? "Отменено"
                                : "В\u00A0процессе"}
                    </span>
                </div>
                <div className="flex justify-between items-center mt-2">

                    <p className="text-gray-600 font-medium break-words" style={{ overflowWrap: 'anywhere' }}>
                        {firstName} {lastName}
                    </p>

                    <div className="flex gap-2 grid grid-cols-1 min-w-max">
                        {username && (
                            <button
                                type="button"
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors flex items-center gap-1 text-xs"
                                onClick={handleUsernameClick}
                            >
                                <MessageSquare size={14} />
                                <span>@{username}</span>
                            </button>
                        )}
                        {phone && (
                            <button
                                type="button"
                                className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-md transition-colors flex items-center gap-1 text-xs"
                                onClick={handleCopyPhone}
                            >
                                <Copy size={14} />
                                <span>{phone}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Секция с психологическими тестами */}
            {psychoTests.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowPsychoTests(!showPsychoTests)}
                        className="w-full text-left flex items-center justify-between text-xl font-semibold mb-4"
                    >
                        Психологические тесты
                        <span className="text-gray-600">
                            {showPsychoTests ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </span>
                    </button>
                    {/* 
                    {showPsychoTests && aiTranscription && completion.status === "COMPLETED" && (
                        <div className="bg-gray-50 p-4 rounded-lg text-black">
                            <div className="space-y-4">
                                <p>Транскрипция:</p>
                                <p>{aiTranscription}</p>
                            </div>
                        </div>
                    )} */}
                    {showPsychoTests && (
                        <AITranscriptionCard
                            aiTranscription={aiTranscription}
                            onGetTranscription={handleGetAiTranscription}
                            onClearTranscription={handleClearAiTranscription}
                            isCompletionFinished={completion.status === "COMPLETED"}
                            hasPsychoTests={psychoTests.length > 0}
                        />
                    )}

                    {showPsychoTests && psychoTests.map((test, index) => (
                        <PsychoTestCard key={`${test.id}-${index}`} test={test} />
                    ))}
                </div>
            )}

            {/* Секция с пользовательскими тестами */}
            {customTests.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowCustomTests(!showCustomTests)}
                        className="w-full text-left flex items-center justify-between text-xl font-semibold mb-4"
                    >
                        Пользовательские тесты
                        <span className="text-gray-600">
                            {showCustomTests ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </span>
                    </button>
                    {showCustomTests && customTests.map((test, index) => (
                        <CustomTestCard key={`${test.id}-${index}`} test={test} />
                    ))}
                </div>
            )}

            {/* Секция с ожидающими выполнения тестами */}
            {completion.pending_tests.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowPendingTests(!showPendingTests)}
                        className="w-full text-left flex items-center justify-between text-xl font-semibold mb-4"
                    >
                        Ожидают выполнения
                        <span className="text-gray-600">
                            {showPendingTests ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </span>
                    </button>
                    {showPendingTests && (
                        <div className="bg-gray-50 p-4 rounded-lg text-black">
                            <ul className="space-y-2">
                                {completion.pending_tests.map((test, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        <span>{test.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isUsernameModalOpen}
                onRequestClose={(e) => {
                    e.stopPropagation();
                    setUsernameModalOpen(false);
                }}
                className="bg-white p-4 rounded shadow-lg max-w-xs mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                shouldCloseOnOverlayClick={true}
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-semibold mb-4">Действия с юзернеймом</h2>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleCopyUsername}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                            Скопировать юзернейм
                        </button>
                        <button
                            onClick={handleOpenChat}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                        >
                            Перейти в чат
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setUsernameModalOpen(false);
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>

        </div>

    );
};

export default TestPackCompletionDetails;
