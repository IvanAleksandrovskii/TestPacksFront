// src/components/TestPackFormTwoGroups.jsx

import React, { useState, useRef } from "react";
import Modal from "react-modal";

// Настройки для чекбоксов
const checkboxStyle = {
    accentColor: '#4CAF50', // Зеленый цвет для галочки
    width: '28px',
    height: '28px'
};

// Настройки для кнопок с описанием теста
const questionButtonStyle = "flex items-center justify-center w-7 h-7 border border-green-500 text-green-500 rounded-sm text-sm hover:bg-green-500 hover:text-white";

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

    // Рефы для скролла
    const packNameRef = useRef(null);


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

        // Проверяем доступность Telegram WebApp
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.HapticFeedback.impactOccurred('light');
        };

        setNameError("");
        setTestsError("");

        let hasError = false;
        if (!packName.trim()) {
            setNameError("Pack name is required");
            hasError = true;
            packNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

    const TestItem = ({ test, isChecked, onToggle, onOpenModal }) => (
        <div className="flex items-center justify-between mb-1 bg-white min-h-[48px] py-2">
            <label className="flex items-center space-x-2 flex-1">
                <div className="flex-shrink-0">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggle(test.id)}
                        style={checkboxStyle}
                    />
                </div>
                <span className="flex-1" style={{
                    color: "black",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                    minHeight: "28px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    {test.name}
                </span>
            </label>
            <div className="flex-shrink-0 ml-2">
                <button
                    className={questionButtonStyle}
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(test);
                    }}
                    style={{ minWidth: "32px" }}
                >
                    ?
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
                {isEdit ? "Обновить набор тестов" : "Создать новый набор тестов"}
            </h2>

            {/* Поле имени */}
            <div className="mb-4" ref={packNameRef}>
                <label className="block mb-1 font-medium">Название:</label>
                <input
                    type="text"
                    style={{ color: "black" }}
                    className={`w-full p-2 border rounded ${nameError ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Введите название набора тестов"
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                />
                {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
            </div>

            {/* Психологические тесты */}
            <div className={`border rounded mb-4 ${testsError ? "border-red-500" : "border-gray-300"}`}>
                <div
                    className="p-2 bg-white rounded flex justify-between items-center cursor-pointer"
                    style={{ border: "1px solid rgb(0, 0, 0)" }}
                    onClick={() => setPsychoExpanded(!psychoExpanded)}
                >
                    <span className="font-semibold text-black">Психологические тесты</span>
                    <span className="text-black">{psychoExpanded ? "▲" : "▼"}</span>
                </div>
                {psychoExpanded && (
                    <div className="p-2 bg-white">
                        {psychoTests.length === 0 && (
                            <p className="text-gray-500">Нет тестов</p>
                        )}
                        {psychoTests.map((test) => (
                            <TestItem
                                key={test.id}
                                test={test}
                                isChecked={selectedPsycho.has(test.id)}
                                onToggle={togglePsychoTest}
                                onOpenModal={openModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Кастомные тесты */}
            <div className={`border rounded mb-4 ${testsError ? "border-red-500" : "border-gray-300"}`}>
                <div
                    className="p-2 bg-white rounded flex justify-between items-center cursor-pointer"
                    style={{ border: "1px solid rgb(0, 0, 0)" }}
                    onClick={() => setCustomExpanded(!customExpanded)}
                >
                    <span className="font-semibold text-black">Кастомные тесты</span>
                    <span className="text-black">{customExpanded ? "▲" : "▼"}</span>
                </div>
                {customExpanded && (
                    <div className="p-2 bg-white">
                        {customTests.length === 0 && (
                            <p className="text-gray-500">Нет тестов</p>
                        )}
                        {customTests.map((test) => (
                            <TestItem
                                key={test.id}
                                test={test}
                                isChecked={selectedCustom.has(test.id)}
                                onToggle={toggleCustomTest}
                                onOpenModal={openModal}
                            />
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
                    {isEdit ? "Сохранить изменения" : "Создать набор"}
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
                                Закрыть
                            </button>
                        </>
                    ) : (
                        <p>Нет данных</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}


export default TestPackFormTwoGroups;
