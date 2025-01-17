// src/pages/TestList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { quizApi } from "../api/quizApi";


const TestList = ({ tgUser }) => {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            setIsLoading(true);
            try {
                const response = await quizApi.getTests(tgUser.id);
                setTests(response);
            } catch (error) {
                console.error("Failed to fetch tests", error);
            } finally {
                setIsLoading(false);
            }
        };
        // Запускаем загрузку только если у нас есть реальный ID пользователя
        if (tgUser && tgUser.id !== 111) {
            fetchTests();
        }
    }, [tgUser]); // Добавляем tgUser в зависимости

    const handleDelete = async (id) => {
        try {
            await quizApi.deleteTest(id, tgUser.id);
            setTests(tests.filter((test) => test.id !== id));
        } catch (error) {
            console.error("Failed to delete test", error);
        }
    };

    // Показываем сообщение о загрузке
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>My Tests</h1>
            <button onClick={() => navigate("/create")}>Create Test</button>
            <ul>
                {tests.map((test) => (
                    <li key={test.id}>
                        <span>{test.name}</span>
                        <br />
                        <button onClick={() => navigate(`/edit/${test.id}`)}>Edit</button>
                        <button onClick={() => handleDelete(test.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default TestList;