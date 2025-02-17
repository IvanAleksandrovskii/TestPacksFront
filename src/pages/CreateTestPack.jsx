// src/pages/CreateTestPack.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // , useParams

import { testPacksApi } from "../api/testPacksApi";
import TestPackFormTwoGroups from "../components/TestPackFormTwoGroups";
import LoadingSpinner from "../components/LoadingSpinner";


function CreateTestPack({ creatorId, creatorUsername }) {
    const navigate = useNavigate();
    // const { packId } = useParams();
    const [psychoTests, setPsychoTests] = useState([]);
    const [customTests, setCustomTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        loadTests();
    }, []);

    // Добавляем обработку кнопки назад
    useEffect(() => {
        const tg = window?.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.onClick(() => {
                navigate('/test_packs');
            });
        }
    }, [navigate]);

    async function loadTests() {
        setLoading(true);
        try {
            const psycho = await testPacksApi.getPsychologicalTests();
            // Если есть getCustomTests:
            const custom = await testPacksApi.getCustomTests(creatorId);
            setPsychoTests(psycho);
            setCustomTests(custom);
        } catch (error) {
            console.error("Error loading tests:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreate = async ({ name, psychoIds, customIds }) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const payload = {
                name,
                creator_id: creatorId,
                creator_username: creatorUsername,
                tests: psychoIds,
                custom_tests: customIds,
            };
            await testPacksApi.createPack(payload);
            navigate("/test_packs");
        } catch (err) {
            console.error("Error creating test pack:", err);
            alert("Error creating test pack. See console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <TestPackFormTwoGroups
            isEdit={false}
            psychoTests={psychoTests}
            customTests={customTests}
            onSubmitPack={handleCreate}
            isSubmitting={isSubmitting}
        />
    );
}

export default CreateTestPack;