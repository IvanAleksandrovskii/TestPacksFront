// src/pages/TestPackCompletionsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import ReactPaginate from "react-paginate";

import { testPacksApi } from "../api/testPacksApi";
import TestPackCompletionCard from "../components/TestPackCompletionCard";
import LoadingSpinner from "../components/LoadingSpinner";

import "../style/pagination.css";

const TestPackCompletionsPage = ({ tgUser, isDarkMode }) => {
    // State initialization with default values
    const [activeTab, setActiveTab] = useState("");
    const [selectedTestPack, setSelectedTestPack] = useState("");
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
    const [isInitialized, setIsInitialized] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // First, handle state restoration from navigation
    useEffect(() => {
        if (location.state && !isInitialized) {
            const { activeTab: savedTab, selectedTestPack: savedPack, currentPage: savedPage, pageSize: savedSize } = location.state;

            setActiveTab(savedTab || "");
            setSelectedTestPack(savedPack || "");
            setCurrentPage(savedPage || 1);
            setPageSize(savedSize || 20);
            setIsInitialized(true);
        } else if (!isInitialized) {
            setIsInitialized(true);
        }
    }, [location.state, isInitialized]);

    // Then fetch data only after state is initialized
    useEffect(() => {
        const fetchData = async () => {
            if (!tgUser?.id || !isInitialized) return;

            setIsLoading(true);
            setError(null);

            try {
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
                    test_pack_list: data.test_pack_list,
                });
            } catch (error) {
                console.error("Fetch error:", error);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab, selectedTestPack, pageSize, currentPage, tgUser, isInitialized]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setCurrentPage(1);
        setSelectedTestPack("");
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleTestPackChange = (e) => {
        setSelectedTestPack(e.target.value);
        setCurrentPage(1);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handleCardClick = (completion) => {
        navigate(`/test-completions/${completion.test_pack_id}`, {
            state: {
                completion,
                filters: {
                    activeTab,
                    selectedTestPack,
                    currentPage,
                    pageSize
                }
            }
        });
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
                        color: isDarkMode
                            ? "rgba(255, 255, 255, 0.6)"
                            : "rgba(0, 0, 0, 0.6)",
                        "&.Mui-selected": {
                            color: isDarkMode ? "#fff" : "#000",
                        },
                        "@media (max-width:900px)": {
                            fontSize: "0.7rem",
                        },
                        "@media (max-width:600px)": {
                            fontSize: "0.6rem",
                        },
                    },
                    "& .MuiTabs-indicator": {
                        backgroundColor: isDarkMode ? "#fff" : "#000",
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
                        {/* <option value={1}>1 на страницу</option> */}
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

            {/* Если есть ошибка – показываем её, а всё остальное не выводим */}
            {error && (
                <div className="text-red-500 text-center p-4">{error}</div>
            )}

            {/* Если идёт загрузка – показываем спиннер */}
            {isLoading && <LoadingSpinner />}

            {/* Если загрузка завершена и нет ошибки, показываем список и пагинацию */}
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
                                    onClick={handleCardClick}
                                />
                            ))}
                        </div>
                    )}

                    {completionsData.total_pages > 1 && (
                        <ReactPaginate
                            pageCount={completionsData.total_pages}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={1}
                            onPageChange={handlePageClick}
                            forcePage={currentPage - 1}
                            containerClassName="pagination-container"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            nextClassName="page-item"
                            breakClassName="page-item"
                            activeClassName="active"
                            previousLabel="<"
                            nextLabel=">"
                            breakLabel="..."
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TestPackCompletionsPage;
