// src/components/AITranscriptionCard.jsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";

const AITranscriptionCard = ({
    aiTranscription,
    onGetTranscription,
    onClearTranscription,
    isCompletionFinished,
    hasPsychoTests
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isCompletionFinished || !hasPsychoTests) {
        return null;
    }

    const handleGetTranscription = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        setError(null);
        try {
            await onGetTranscription();
        } catch (error) {
            setError(error.response?.data?.detail || 'Ошибка при получении расшифровки');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearTranscription = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        setError(null);
        try {
            await onClearTranscription();
        } catch (error) {
            setError(error.response?.data?.detail || 'Ошибка при очистке расшифровки');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4 border rounded-lg shadow-sm bg-white text-black">
            <div
                className="p-4 border-b cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-semibold">ИИ расшифровка результатов</h3>
                <div className="text-gray-500 text-xl">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </div>

            {isOpen && (
                <div className="p-4">
                    {error && (
                        <div className="text-red-500 mb-4">
                            {error}
                        </div>
                    )}
                    {!aiTranscription ? (
                        <div className="flex justify-center">
                            <button
                                onClick={handleGetTranscription}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Загрузка...' : 'Получить расшифровку от ИИ'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="whitespace-pre-wrap">
                                {aiTranscription}
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleClearTranscription}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Очистка...' : 'Очистить расшифровку'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AITranscriptionCard;