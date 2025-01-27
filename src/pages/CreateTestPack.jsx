// src/pages/CreateTestPack.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { testPacksApi } from "../api/testPacksApi";
import TestPackFormTwoGroups from "../components/TestPackFormTwoGroups";


const CreateTestPack = ({ creatorId, creatorUsername }) => {
    const navigate = useNavigate();

    // Массив психологических тестов
    const [psychoTests, setPsychoTests] = useState([]);
    // Массив кастомных тестов
    const [customTests, setCustomTests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTests();
    }, []);

    async function loadTests() {
        setLoading(true);
        try {
            const psycho = await testPacksApi.getPsychologicalTests();
            // Предположим, у вас есть метод getCustomTests()
            const custom = await testPacksApi.getCustomTests(creatorId);
            // Если нужно, у каждой записи в custom: {id, name, description}.

            setPsychoTests(psycho);
            setCustomTests(custom);
        } catch (err) {
            console.error("Failed to load tests:", err);
            setError("Could not load tests.");
        } finally {
            setLoading(false);
        }
    }

    // Сохранение (создание)
    const handleCreate = async ({ name, psychoIds, customIds }) => {
        try {
            // Формируем payload
            const payload = {
                name,
                creator_id: creatorId,
                creator_username: creatorUsername || undefined,
                tests: psychoIds,        // психологические ID
                custom_tests: customIds, // кастомные ID
            };
            await testPacksApi.createPack(payload);
            navigate("/packs");
        } catch (err) {
            console.error("Error creating test pack:", err);
            alert("Error creating test pack. See console.");
        }
    };

    const handleCancel = () => {
        navigate("/packs");
    };

    if (loading) {
        return <div>Loading tests...</div>;
    }
    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    return (
        <TestPackFormTwoGroups
            isEdit={false}
            initialPackName=""
            initialPsychoIds={[]}    // при создании ничего не выбрано
            initialCustomIds={[]}    // при создании ничего не выбрано
            psychoTests={psychoTests}
            customTests={customTests}
            onSubmitPack={handleCreate}
            onCancel={handleCancel}
        />
    );
}

export default CreateTestPack;
