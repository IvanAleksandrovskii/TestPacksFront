// src/components/TestPackCompletionDetails.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { testPacksApi } from "../api/testPacksApi";


const TestPackCompletionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [completion, setCompletion] = useState(null);

    useEffect(() => {
        const fetchCompletion = async () => {
            try {
                const response = await testPacksApi.getTestCompletionById(id);
                setCompletion(response.data);
                // setCompletion(response);
            } catch (error) {
                console.error("Ошибка загрузки теста:", error);
            }
        };
        fetchCompletion();
    }, [id]);

    if (!completion) {
        return <p className="text-center text-gray-500 mt-6">Прохождение не найдено</p>;
    }

    return (
        <div className="p-4">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Назад
            </button>

            <h1 className="text-2xl font-bold my-4">{completion.test_pack_id}</h1>
            <p className="text-gray-500">Статус: {completion.status}</p>

            <div className="mt-4">
                <h2 className="text-xl font-semibold">Ожидающие тесты</h2>
                {completion.pending_tests.length > 0 ? (
                    <ul className="list-disc ml-6">
                        {completion.pending_tests.map((test) => (
                            <li key={test.id}>{test.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Нет ожидающих тестов</p>
                )}
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-semibold">Завершенные тесты</h2>
                {completion.completed_tests.length > 0 ? (
                    <ul className="list-disc ml-6">
                        {completion.completed_tests.map((test) => (
                            <li key={test.id}>{test.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Нет завершенных тестов</p>
                )}
            </div>
        </div>
    );
};

export default TestPackCompletionDetails;
