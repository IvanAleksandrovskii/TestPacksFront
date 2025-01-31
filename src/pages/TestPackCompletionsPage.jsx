// src/pages/TestPackCompletionsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Pagination } from "@mui/material";

import { testPacksApi } from "../api/testPacksApi";
import TestPackCompletionCard from "../components/TestPackCompletionCard";
import LoadingSpinner from "../components/LoadingSpinner";


const TestPackCompletionsPage = ({ tgUser }) => {
    const [activeTab, setActiveTab] = useState("IN_PROGRESS");
    const [completionsData, setCompletionsData] = useState({
        total_count: 0,
        data: [],
        current_page: 1,
        total_pages: 0
    });
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!tgUser?.id) return;

            setIsLoading(true);
            setError(null);

            try {
                const data = await testPacksApi.getTestCompletions(
                    tgUser.id,
                    activeTab,
                    currentPage, // Используем текующую страницу
                    pageSize
                );

                setCompletionsData({
                    total_count: data.total_count,
                    data: data.data,
                    current_page: data.current_page,
                    total_pages: data.total_pages
                });
            } catch (error) {
                console.error("Fetch error:", error);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab, pageSize, currentPage, tgUser]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        // При смене вкладки сбрасываем номер страницы на 1
        setCurrentPage(1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        // Сбрасываем номер страницы при изменении количества элементов на странице
        setCurrentPage(1);
    };

    return (<div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Мои прохождения тестов</h1>

        <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            className="mb-6"
        >
            <Tab label="В процессе" value="IN_PROGRESS" />
            <Tab label="Завершённые" value="COMPLETED" />
            <Tab label="Отменённые" value="ABANDONED" />
        </Tabs>

        <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
                Найдено: {completionsData.total_count}
            </div>
            <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="px-3 py-1 border rounded text-black"
            >
                <option value={5}>5 на странице</option>
                <option value={10}>10 на странице</option>
                <option value={20}>20 на странице</option>
                <option value={50}>50 на странице</option>
                <option value={100}>100 на странице</option>
            </select>
        </div>

        {isLoading && <LoadingSpinner />}

        {error && (
            <div className="text-red-500 text-center p-4">{error}</div>
        )}

        {!isLoading && !error && (
            <>
                {completionsData.data.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">
                        Нет прохождений в этом разделе
                    </div>
                ) : (
                    <div className="space-y-4 mb-6">
                        {completionsData.data.map((completion) => (
                            <TestPackCompletionCard
                                key={completion.test_pack_id}
                                completion={completion}
                                onClick={() => navigate(`/test-completions/${completion.test_pack_id}`)}
                            />
                        ))}
                    </div>
                )}
                {/* Если страниц больше одной, выводим пагинацию */}
                {completionsData.total_pages > 1 && (
                    <div className="flex justify-center mt-4">
                        <Pagination
                            count={completionsData.total_pages}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                            color="primary"
                            className="mb-6"
                        />
                    </div>
                )}
            </>
        )}
    </div>
    );
};

export default TestPackCompletionsPage;