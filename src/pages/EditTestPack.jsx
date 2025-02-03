// src/pages/EditTestPack.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { testPacksApi } from "../api/testPacksApi";
import TestPackFormTwoGroups from "../components/TestPackFormTwoGroups";
import LoadingSpinner from "../components/LoadingSpinner";


function EditTestPack() {
    const { packId } = useParams();
    const navigate = useNavigate();

    const [packName, setPackName] = useState("");
    const [psychoTests, setPsychoTests] = useState([]);
    const [customTests, setCustomTests] = useState([]);
    const [psychoIdsSelected, setPsychoIdsSelected] = useState([]);
    const [customIdsSelected, setCustomIdsSelected] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [packId]);

    // Добавляем обработку кнопки назад
    useEffect(() => {
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.onClick(() => {
                navigate('/test_packs');
            });
        }
    }, [navigate]);

    async function loadData() {
        setLoading(true);
        try {
            // Загружаем сам пак
            const packData = await testPacksApi.getPack(packId);
            setPackName(packData.name);
            const existingPsycho = packData.tests.map(t => t.id);
            const existingCustom = packData.custom_tests.map(ct => ct.id);
            setPsychoIdsSelected(existingPsycho);
            setCustomIdsSelected(existingCustom);

            // Загружаем доступные тесты
            const psycho = await testPacksApi.getPsychologicalTests();
            const custom = await testPacksApi.getCustomTests(packData.creator_id);

            setPsychoTests(psycho);
            setCustomTests(custom);
        } catch (err) {
            console.error("Error loading pack data:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async ({ name, psychoIds, customIds }) => {
        try {
            const payload = {
                name,
                tests: psychoIds,
                custom_tests: customIds,
            };
            await testPacksApi.updatePack(packId, payload);
            navigate("/test_packs");
        } catch (err) {
            console.error("Error updating pack:", err);
            alert("Error updating test pack. See console.");
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <TestPackFormTwoGroups
            isEdit
            initialPackName={packName}
            initialPsychoIds={psychoIdsSelected}
            initialCustomIds={customIdsSelected}
            psychoTests={psychoTests}
            customTests={customTests}
            onSubmitPack={handleUpdate}
        />
    );
}

export default EditTestPack;
