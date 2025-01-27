// src/pages/TestList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import { quizApi } from "../api/quizApi";


Modal.setAppElement("#root");


const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onCancel}
        className="fixed inset-0 flex items-center justify-center z-50"
    >
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this test?</h2>
            <div className="flex justify-around mt-4 grid grid-cols-2 gap-2">
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={onConfirm}
                >
                    Yes
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    No
                </button>
            </div>
        </div>
    </Modal>
);

const TestList = ({ tgUser }) => {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [testToDelete, setTestToDelete] = useState(null); // ID теста для удаления
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            setIsLoading(true);
            try {
                // Предполагаем, что quizApi.getTests(userId) вернёт список тестов
                const response = await quizApi.getTests(tgUser.id);
                setTests(response);
            } catch (error) {
                console.error("Failed to fetch tests", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (tgUser && tgUser.id !== 111) {
            fetchTests();
        }
    }, [tgUser]);

    const handleDelete = async () => {
        if (!testToDelete) return;
        try {
            // Предполагаем, что quizApi.deleteTest(testId, userId) удалит тест
            await quizApi.deleteTest(testToDelete, tgUser.id);
            setTests(tests.filter((test) => test.id !== testToDelete));
        } catch (error) {
            console.error("Failed to delete test", error);
        } finally {
            setModalOpen(false);
            setTestToDelete(null);
        }
    };

    const openModal = (testId) => {
        setTestToDelete(testId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTestToDelete(null);
    };

    if (isLoading) {
        return <div className="text-center text-gray-500 mt-12">Loading...</div>;
    }

    // Проверяем лимит: если уже есть 5 тестов, кнопка будет неактивной
    const MAX_TESTS = 5;
    const isLimitReached = tests.length >= MAX_TESTS;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1
                className="text-2xl font-bold mb-6 text-center"
            >
                My Tests
            </h1>

            <ul className="space-y-4">
                {tests.map((test) => (
                    <li
                        key={test.id}
                        className="flex flex-col p-4 border rounded shadow-sm bg-white"
                    >
                        <span className="text-lg font-medium mb-3" style={{color: "black"}}>{test.name}</span>
                        <div className="flex justify-end gap-1 mt-2 grid grid-cols-2 gap-2">
                            <button
                                onClick={() => openModal(test.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => navigate(`/edit/${test.id}`)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Edit
                            </button>
                        </div>
                    </li>
                ))}
                {tests.length === 0 && (
                    <p className="text-center text-gray-500">No tests created yet</p>
                )}
            </ul>

            {/* Кнопка "Create Test" или "To create a test delete one" */}
            <button
                onClick={() => !isLimitReached && navigate("/create")}
                disabled={isLimitReached}
                className={`px-4 py-2 w-full rounded mb-4 mt-4 text-white ${isLimitReached
                        ? "bg-gray-500 cursor-not-allowed hover:bg-gray-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
            >
                {isLimitReached ? "To create a test delete one" : "Create Test"}
            </button>

            <DeleteConfirmation
                isOpen={isModalOpen}
                onConfirm={handleDelete}
                onCancel={closeModal}
            />
        </div>
    );
};

export default TestList;
