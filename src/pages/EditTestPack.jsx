// src/pages/EditTestPack.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { testPacksApi } from "../api/testPacksApi";

const EditTestPack = () => {
    const { packId } = useParams();   // /packs/edit/:packId
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [tests, setTests] = useState("");
    const [customTests, setCustomTests] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPack();
    }, [packId]);

    async function loadPack() {
        setLoading(true);
        try {
            const packData = await testPacksApi.getPack(packId);
            // packData.tests и packData.custom_tests – это списки названий (строк) из TestPackOut (в вашем коде)
            // Если нужно отобразить UUID, надо изменить бэкенд, чтобы возвращал ID.
            // В демо оставим как есть: можно отредактировать только name, а tests/custom_tests пока «readonly».

            setName(packData.name);

            // packData.tests = ["Test A", "Test B"], packData.custom_tests = ["Custom X", "Custom Y"]
            // В реальном проекте желательно, чтобы бэкенд отдавал ID. Тогда можно мапить. 
            // Пока просто склеим в строку.
            setTests(packData.tests.join(", "));
            setCustomTests(packData.custom_tests.join(", "));
        } catch (err) {
            console.error("Failed to load pack:", err);
            setError("Could not load test pack data.");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate() {
        // Если хотите, чтобы пользователь мог менять tests/custom_tests, нужно 
        // их разбивать по запятой обратно в массив UUID. 
        // Но у вас сейчас packData.tests — это не UUID, а названия. 
        // Для примера разрешим изменить только name.

        try {
            await testPacksApi.updatePack(packId, { name });
            navigate("/packs");
        } catch (err) {
            console.error("Failed to update test pack:", err);
            setError("Error updating test pack. Check console for details.");
        }
    }

    if (loading) {
        return <div className="text-center text-gray-500 mt-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-8">{error}</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Test Pack</h1>

            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        style={{ color: "black" }}
                        className="w-full p-2 border rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Примеры полей, которые можно сделать read-only, если ID недоступны */}
                <div>
                    <label className="block mb-1 font-medium">Tests (Titles)</label>
                    <input
                        type="text"
                        style={{ color: "black" }}
                        className="w-full p-2 border rounded text-gray-500 bg-gray-100"
                        value={tests}
                        readOnly
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Custom Tests (Titles)</label>
                    <input
                        type="text"
                        style={{ color: "black" }}
                        className="w-full p-2 border rounded text-gray-500 bg-gray-100"
                        value={customTests}
                        readOnly
                    />
                </div>

                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                >
                    Save Changes
                </button>

                <button
                    onClick={() => navigate("/packs")}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 w-full mt-2"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default EditTestPack;
