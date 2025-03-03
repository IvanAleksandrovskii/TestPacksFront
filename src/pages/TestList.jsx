import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { Pencil, Trash2, HelpCircle } from "lucide-react";

import { quizApi } from "../api/quizApi";
import LoadingSpinner from "../components/LoadingSpinner";

import TestDetailsView from "../components/TestDetailsView";

Modal.setAppElement("#root");

const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onCancel}
        className="fixed inset-0 flex items-center justify-center z-50"
    >
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">
                Вы уверены, что хотите удалить тест?
                <strong>
                    Этот тест будет удален из всех наборов,
                    а опустевшие полностью из них так же
                    будут удалены
                </strong>
            </h2>
            <div className="flex justify-around mt-4 grid grid-cols-2 gap-2">
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={onConfirm}
                >
                    Да
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Нет
                </button>
            </div>
        </div>
    </Modal>
);

function TestList({ tgUser }) {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [testToDelete, setTestToDelete] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            setIsLoading(true);
            try {
                const response = await quizApi.getTests(tgUser.id);
                setTests(response);
            } catch (error) {
                console.error("Failed to fetch tests", error);
                setError("Произошла ошибка при загрузке данных. Попробуйте позже.");
            } finally {
                setIsLoading(false);
            }
        };

        if (tgUser && tgUser.id !== 111) {
            fetchTests();
        }
    }, [tgUser]);

    const openModal = (testId) => {

        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

        setTestToDelete(testId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTestToDelete(null);
    };

    const handleDelete = async () => {
        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

        if (!testToDelete) return;
        try {
            await quizApi.deleteTest(testToDelete, tgUser.id);
            setTests(tests.filter((test) => test.id !== testToDelete));
        } catch (error) {
            console.error("Failed to delete test", error);
        } finally {
            setModalOpen(false);
            setTestToDelete(null);
        }
    };

    if (isLoading) return (
        <div className="p-2 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Мои тесты</h1>
            <LoadingSpinner />
        </div>
    );

    if (error) return (
        <div className="p-2 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Мои тесты</h1>
            <div className="text-red-500 text-center p-4">{error}</div>
        </div>
    );

    const MAX_TESTS = 10;
    const isLimitReached = tests.length >= MAX_TESTS;

    const handleNavigation = (path) => {
        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        }

        // Навигация
        navigate(path);
    };

    return (
        <div className="p-2 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Мои тесты</h1>

            <ul className="space-y-4">
                {tests.map((test) => (
                    <li
                        key={test.id}
                        onClick={() => setSelectedTest(test)}
                        className="flex flex-col p-4 border rounded shadow-sm bg-white hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <span
                                    className="text-lg font-medium break-words"
                                    style={{
                                        color: "black",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        hyphens: "auto",
                                    }}
                                >
                                    {test.name}
                                </span>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                    <HelpCircle size={14} />
                                    <span>Вопросов: {test.questions?.length || 0}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openModal(test.id);
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete test"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigation(`/edit/${test.id}`);
                                    }}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Edit test"
                                >
                                    <Pencil size={20} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
                {tests.length === 0 && (
                    <p className="text-center text-gray-500">Нет созданных тестов</p>
                )}
            </ul>

            <button
                onClick={() => !isLimitReached && handleNavigation("/create")}
                disabled={isLimitReached}
                className={`px-4 py-2 w-full rounded mb-8 mt-4 text-white ${isLimitReached
                    ? "bg-gray-500 cursor-not-allowed hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                    }`}
            >
                {isLimitReached ? "Вы создали максимум тестов" : "Создать тест"}
            </button>

            <DeleteConfirmation
                isOpen={isModalOpen}
                onConfirm={handleDelete}
                onCancel={closeModal}
            />

            <TestDetailsView
                isOpen={!!selectedTest}
                onClose={() => setSelectedTest(null)}
                data={selectedTest}
                type="test"
            />

        </div>
    );
}

export default TestList;