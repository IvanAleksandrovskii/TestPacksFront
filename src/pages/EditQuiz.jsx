// src/components/EditQuiz.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizApi } from "../api/quizApi";

const EditQuiz = (creatorId) => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const test = await quizApi.getTest(id, creatorId);
                setName(test.name);
                setDescription(test.description);
            } catch (error) {
                console.error("Failed to fetch test", error);
            }
        };
        fetchTest();
    }, [id]);

    const handleSubmit = async () => {
        try {
            await quizApi.updateTest(id, { name, description });
            navigate("/");
        } catch (error) {
            console.error("Failed to update test", error);
        }
    };

    return (
        <div>
            <h1>Edit Test</h1>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default EditQuiz;
