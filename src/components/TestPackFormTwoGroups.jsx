// src/components/TestPackFormTwoGroups.jsx

import React, { useState } from "react";
import Modal from "react-modal";

// Настройки для чекбоксов
const checkboxStyle = {
    accentColor: '#4CAF50', // Зеленый цвет для галочки
    width: '16px',
    height: '16px'
};

function TestPackFormTwoGroups({
    isEdit = false,
    initialPackName = "",
    initialPsychoIds = [],
    initialCustomIds = [],
    psychoTests = [],       // [{id, name, description}, ...]
    customTests = [],       // [{id, name, description}, ...]
    onSubmitPack,           // (payload) => void
}) {
    const [packName, setPackName] = useState(initialPackName);

    // Хранение выбранных ID:
    const [selectedPsycho, setSelectedPsycho] = useState(new Set(initialPsychoIds));
    const [selectedCustom, setSelectedCustom] = useState(new Set(initialCustomIds));

    // Разворачивание/сворачивание двух групп
    const [psychoExpanded, setPsychoExpanded] = useState(true);
    const [customExpanded, setCustomExpanded] = useState(true);

    // Модальное окно «детали теста»
    const [showModal, setShowModal] = useState(false);
    const [modalTest, setModalTest] = useState(null);

    // Поля для отображения ошибок
    const [nameError, setNameError] = useState("");
    const [testsError, setTestsError] = useState("");

    // Обработчики
    const togglePsychoTest = (testId) => {
        setSelectedPsycho((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(testId)) {
                newSet.delete(testId);
            } else {
                newSet.add(testId);
            }
            return newSet;
        });
    };

    const toggleCustomTest = (testId) => {
        setSelectedCustom((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(testId)) {
                newSet.delete(testId);
            } else {
                newSet.add(testId);
            }
            return newSet;
        });
    };

    const openModal = (testObj) => {
        setModalTest(testObj);
        setShowModal(true);
    };

    const closeModal = () => {
        setModalTest(null);
        setShowModal(false);
    };

    const handleSubmit = () => {
        setNameError("");
        setTestsError("");

        let hasError = false;
        if (!packName.trim()) {
            setNameError("Pack name is required");
            hasError = true;
        }
        const totalSelected = selectedPsycho.size + selectedCustom.size;
        if (totalSelected === 0) {
            setTestsError("At least one test must be selected");
            hasError = true;
        }
        if (hasError) return;

        onSubmitPack({
            name: packName.trim(),
            psychoIds: Array.from(selectedPsycho),
            customIds: Array.from(selectedCustom),
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
                {isEdit ? "Edit Test Pack" : "Create New Test Pack"}
            </h2>

            {/* Поле имени */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Pack Name:</label>
                <input
                    type="text"
                    style={{ color: "black" }}
                    className={`w-full p-2 border rounded ${nameError ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="Enter pack name"
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                />
                {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
            </div>

            {/* Психологические тесты */}
            <div
                className={`border rounded mb-4 ${testsError ? "border-red-500" : "border-gray-300"
                    }`}
            >
                <div
                    className="p-2 bg-gray-500 rounded flex justify-between items-center cursor-pointer"
                    onClick={() => setPsychoExpanded(!psychoExpanded)}
                >
                    <span className="font-semibold text-white">Psychological Tests</span>
                    <span className="text-white">{psychoExpanded ? "▲" : "▼"}</span>
                </div>
                {psychoExpanded && (
                    <div className="p-2">
                        {psychoTests.length === 0 && (
                            <p className="text-gray-500">No tests</p>
                        )}
                        {psychoTests.map((test) => (
                            <div
                                key={test.id}
                                className="flex items-center justify-between mb-1"
                            >
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedPsycho.has(test.id)}
                                        onChange={() => togglePsychoTest(test.id)}
                                        style={checkboxStyle}
                                    />
                                    <span>{test.name}</span>
                                </label>
                                {/* КНОПКА-ИКОНКА 16x16 c «?» */}
                                <button
                                    className="flex items-center justify-center w-4 h-4 border border-green-500 text-green-500 rounded-sm text-xs hover:bg-green-500 hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openModal(test);
                                    }}
                                >
                                    ?
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Кастомные тесты */}
            <div
                className={`border rounded mb-4 ${testsError ? "border-red-500" : "border-gray-300"
                    }`}
            >
                <div
                    className="p-2 bg-gray-500 rounded flex justify-between items-center cursor-pointer"
                    onClick={() => setCustomExpanded(!customExpanded)}
                >
                    <span className="font-semibold text-white">Custom Tests</span>
                    <span className="text-white">{customExpanded ? "▲" : "▼"}</span>
                </div>
                {customExpanded && (
                    <div className="p-2">
                        {customTests.length === 0 && (
                            <p className="text-gray-500">No tests</p>
                        )}
                        {customTests.map((test) => (
                            <div
                                key={test.id}
                                className="flex items-center justify-between mb-1"
                            >
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustom.has(test.id)}
                                        onChange={() => toggleCustomTest(test.id)}
                                        style={checkboxStyle}
                                    />
                                    <span>{test.name}</span>
                                </label>
                                {/* КНОПКА-ИКОНКА 16x16 c «?» */}
                                <button
                                    className="flex items-center justify-center w-4 h-4 border border-green-500 text-green-500 rounded-sm text-xs hover:bg-green-500 hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openModal(test);
                                    }}
                                >
                                    ?
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {testsError && (
                <p className="text-red-500 text-sm mb-2">{testsError}</p>
            )}

            <div className="grid grid-cols-1 gap-1">
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {isEdit ? "Save Changes" : "Create Pack"}
                </button>
            </div>

            {/* Модалка «?» для подробностей */}
            <Modal
                isOpen={showModal}
                onRequestClose={closeModal}
                contentLabel="Test Details"
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
            >
                <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                    {modalTest ? (
                        <>
                            <h3 className="text-lg font-bold mb-2">{modalTest.name}</h3>
                            <p className="mb-4">{modalTest.description}</p>
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 w-full"
                            >
                                Close
                            </button>
                        </>
                    ) : (
                        <p>No data</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}


export default TestPackFormTwoGroups;
