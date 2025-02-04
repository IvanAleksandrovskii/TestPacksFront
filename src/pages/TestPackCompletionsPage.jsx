// src/pages/TestPackCompletionsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Pagination } from "@mui/material";

import { testPacksApi } from "../api/testPacksApi";
import TestPackCompletionCard from "../components/TestPackCompletionCard";
import LoadingSpinner from "../components/LoadingSpinner";

const TestPackCompletionsPage = ({ tgUser, isDarkMode }) => {
    // Управляем вкладками: "IN_PROGRESS", "COMPLETED", "ABANDONED"
    const [activeTab, setActiveTab] = useState("");
    // Фильтр по выбранному тест-паку (по его UUID)
    const [selectedTestPack, setSelectedTestPack] = useState("");
    // Состояние для данных, полученных из API, включая список тестпаков
    const [completionsData, setCompletionsData] = useState({
        total_count: 0,
        data: [],
        current_page: 1,
        total_pages: 0,
        test_pack_list: [],
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
                // Передаём user_id, статус (activeTab), выбранный тест-пак, номер страницы и размер страницы
                const data = await testPacksApi.getTestCompletions(
                    tgUser.id,
                    activeTab,
                    selectedTestPack,
                    currentPage,
                    pageSize
                );
                setCompletionsData({
                    total_count: data.total_count,
                    data: data.data,
                    current_page: data.current_page,
                    total_pages: data.total_pages,
                    test_pack_list: data.test_pack_list, // список тестпаков возвращается API
                });
            } catch (error) {
                console.error("Fetch error:", error);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab, selectedTestPack, pageSize, currentPage, tgUser]);

    // Обработчик смены вкладок – сбрасываем текущую страницу
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setCurrentPage(1);
        setSelectedTestPack("");
    };

    // Изменение количества элементов на странице – сброс страницы
    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    // Обработчик выбора тест-пака из выпадающего списка – сброс страницы
    const handleTestPackChange = (e) => {
        setSelectedTestPack(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Прохождения наборов тестов
            </h1>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                className="mb-6"
                sx={{
                    "& .MuiTab-root": {
                        fontSize: "0.8rem",
                        color: isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
                        "&.Mui-selected": {
                            color: isDarkMode ? "#fff" : "#000", // Цвет активной вкладки
                        },
                        "@media (max-width:900px)": {
                            fontSize: "0.7rem",
                        },
                        "@media (max-width:600px)": {
                            fontSize: "0.6rem",
                        },
                    },
                    "& .MuiTabs-indicator": {
                        backgroundColor: isDarkMode ? "#fff" : "#000", // Цвет подчеркивания активной вкладки
                    },
                }}
            >
                <Tab label="Все" value="" />
                <Tab label="Завершённые" value="COMPLETED" />
                <Tab
                    label="В процессе"
                    value="IN_PROGRESS"
                    style={{ whiteSpace: "nowrap" }}
                />
                <Tab label="Отменённые" value="ABANDONED" />
            </Tabs>

            {/* Верхняя панель: общее количество, выбор количества элементов и фильтр по тест-паку */}
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Найдено: {completionsData.total_count}
                </div>
                <div className="flex gap-4 items-center">
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
            </div>
            <div className="mb-4 flex items-center justify-between">
                <select
                    value={selectedTestPack}
                    onChange={handleTestPackChange}
                    className="px-3 py-1 border rounded text-black w-full"
                >
                    <option value="">Все тест-паки</option>
                    {completionsData.test_pack_list.map((pack) => (
                        <option key={pack.test_pack_id} value={pack.test_pack_id}>
                            {pack.test_pack_name}
                        </option>
                    ))}
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
                                    onClick={() =>
                                        navigate(`/test-completions/${completion.test_pack_id}`)
                                    }
                                />
                            ))}
                        </div>
                    )}
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
