// src/pages/EditTestPack.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { testPacksApi } from "../api/testPacksApi";

const EditTestPack = () => {
    const { packId } = useParams();
    const navigate = useNavigate();

    const [packName, setPackName] = useState("");
    const [psychoTests, setPsychoTests] = useState([]);
    const [customTests, setCustomTests] = useState([]);

    // ID, которые уже выбраны
    const [psychoIdsSelected, setPsychoIdsSelected] = useState([]);
    const [customIdsSelected, setCustomIdsSelected] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [packId]);

    async function loadData() {
        setLoading(true);
        try {
            // 1) Получаем сам pack
            const packData = await testPacksApi.getPack(packId);
            setPackName(packData.name);

            // packData.tests -> [{id, name, description}...]
            const existingPsycho = packData.tests.map((t) => t.id);
            // packData.custom_tests -> [{id, name, description}...]
            const existingCustom = packData.custom_tests.map((ct) => ct.id);

            setPsychoIdsSelected(existingPsycho);
            setCustomIdsSelected(existingCustom);

            // 2) Загружаем доступные тесты
            const psycho = await testPacksApi.getPsychologicalTests();
            // Предположим, для custom:
            // const custom = await testPacksApi.getCustomTests(someCreatorId);
            // Если у нас хранится creator_id в packData, можно использовать packData.creator_id
            const custom = await testPacksApi.getCustomTests(packData.creator_id);

            setPsychoTests(psycho);
            setCustomTests(custom);

        } catch (err) {
            console.error("Failed to load pack or tests", err);
            setError("Could not load data. See console.");
        } finally {
            setLoading(false);
        }
    }

    // Сохранение (редактирование)
    const handleUpdate = async ({ name, psychoIds, customIds }) => {
        try {
            const payload = {
                name,
                tests: psychoIds,
                custom_tests: customIds,
            };
            await testPacksApi.updatePack(packId, payload);
            navigate("/packs");
        } catch (err) {
            console.error("Error updating test pack:", err);
            alert("Error updating test pack. See console.");
        }
    };

    const handleCancel = () => {
        navigate("/packs");
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    return (
        <TestPackFormTwoGroups
            isEdit
            initialPackName={packName}
            initialPsychoIds={psychoIdsSelected}
            initialCustomIds={customIdsSelected}
            psychoTests={psychoTests}
            customTests={customTests}
            onSubmitPack={handleUpdate}
            onCancel={handleCancel}
        />
    );
}

export default EditTestPack;
