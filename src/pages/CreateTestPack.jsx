// src/pages/CreateTestPack.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { testPacksApi } from "../api/testPacksApi";
import TestPackFormTwoGroups from "../components/TestPackFormTwoGroups";

function CreateTestPack({ creatorId, creatorUsername }) {
    const navigate = useNavigate();
    const { packId } = useParams();
    const [psychoTests, setPsychoTests] = useState([]);
    const [customTests, setCustomTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTests();
    }, []);

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
        try {
            const payload = {
                name,
                creator_id: creatorId,
                creator_username: creatorUsername,
                tests: psychoIds,
                custom_tests: customIds,
            };
            await testPacksApi.createPack(payload);
            // После сохранения => /test_packs
            navigate("/test_packs");
        } catch (err) {
            console.error("Error creating test pack:", err);
            alert("Error creating test pack. See console.");
        }
    };

    if (loading) return <div className="text-center text-gray-500 mt-12">Loading...</div>;

    return (
        <TestPackFormTwoGroups
            isEdit={false}
            psychoTests={psychoTests}
            customTests={customTests}
            onSubmitPack={handleCreate}
        />
    );
}

export default CreateTestPack;