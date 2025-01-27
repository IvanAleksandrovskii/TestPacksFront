// src/pages/CreateTestPack.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { testPacksApi } from "../api/testPacksApi";

const CreateTestPack = ({ creatorId, creatorUsername = "" }) => {
    const navigate = useNavigate();

    // Состояния для формы
    const [name, setName] = useState("");
    const [tests, setTests] = useState("");           // "uuid1, uuid2"
    const [customTests, setCustomTests] = useState(""); // "uuid3, uuid4"
    const [error, setError] = useState(null);

    const handleCreate = async () => {
        // Валидация (минимальная)
        if (!name.trim()) {
            setError("Pack name is required");
            return;
        }
        setError(null);

        // Разбираем строки с UUID в массив
        const parsedTests = tests
            .split(",")
            .map((val) => val.trim())
            .filter((val) => val.length > 0);
        const parsedCustom = customTests
            .split(",")
            .map((val) => val.trim())
            .filter((val) => val.length > 0);

        // Формируем payload для API
        const payload = {
            name: name,
            creator_id: creatorId,
            creator_username: creatorUsername,
            tests: parsedTests,
            custom_tests: parsedCustom,
        };

        try {
            await testPacksApi.createPack(payload);
            navigate("/packs"); // Возвращаемся к списку после создания
        } catch (err) {
            console.error("Failed to create test pack:", err);
            setError("Error creating test pack. Check console for details.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create New Test Pack</h1>

            {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        style={{ color: "black" }}
                        className="w-full p-2 border rounded"
                        placeholder="Pack name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Tests (UUID, comma-separated)</label>
                    <input
                        type="text"
                        style={{ color: "black" }}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. c3b1d54c-..., bc3dadb4-..."
                        value={tests}
                        onChange={(e) => setTests(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Custom Tests (UUID, comma-separated)</label>
                    <input
                        type="text"
                        style={{ color: "black" }}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. 11223344-..., aabbbccc-..."
                        value={customTests}
                        onChange={(e) => setCustomTests(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                >
                    Create
                </button>

                <button
                    onClick={() => navigate("/packs")}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 w-full mt-2"
                >
                    Back to Packs
                </button>
            </div>
        </div>
    );
};

export default CreateTestPack;
