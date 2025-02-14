// src/components/TestDetailsView.jsx

import React from 'react';
import Modal from 'react-modal';
import { X, HelpCircle, Package, FileQuestion } from 'lucide-react';


const TestDetailsView = ({ isOpen, onClose, data, type = 'test' }) => {
    const isPack = type === 'pack';

    const renderTestsList = (tests, title) => {
        if (!tests?.length) return null;

        return (
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FileQuestion size={20} />
                    {title}
                </h3>
                <ul className="space-y-2">
                    {tests.map((test, index) => {
                        return (
                            <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium">{test}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    const renderQuestions = (questions) => {
        if (!questions?.length) return null;

        return (
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <HelpCircle size={20} />
                    Вопросы
                </h3>
                <ul className="space-y-4">
                    {questions.map((question, index) => (
                        <li key={index} className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-2">
                                {index + 1}. {question.question_text}
                            </p>
                            {question.answers?.length > 0 && (
                                <div className="ml-4 space-y-2">
                                    {question.answers.map((answer, aIndex) => (
                                        <div key={aIndex} className="flex items-center gap-2">
                                            <span className="w-6 h-6 flex items-center justify-center bg-white border rounded-full text-sm">
                                                {aIndex + 1}
                                            </span>
                                            <span>{answer.text}</span>
                                            {answer.score !== undefined && (
                                                <span className="text-sm text-gray-500 ml-auto">
                                                    {answer.score} баллов
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {isPack ? <Package size={24} /> : <FileQuestion size={24} />}
                        <h2 className="text-xl font-bold">{data?.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Description */}
                {data?.description && (
                    <p className="text-gray-600 mt-2">{data.description}</p>
                )}

                {/* Content */}
                {isPack ? (
                    <>
                        {renderTestsList(data?.tests, 'Психологические тесты')}
                        {renderTestsList(data?.custom_tests, 'Пользовательские тесты')}
                    </>
                ) : (
                    renderQuestions(data?.questions)
                )}
            </div>
        </Modal>
    );
};

export default TestDetailsView;
