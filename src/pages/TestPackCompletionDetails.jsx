import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const PsychoTestCard = ({ test }) => (
    <div className="mb-4 border rounded-lg shadow-sm bg-white text-black">
        <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">{test.name}</h3>
            <div className="text-sm text-gray-500">
                Завершён: {format(new Date(test.completed_at), "dd MMM yyyy HH:mm", { locale: ru })}
            </div>
        </div>
        <div className="p-4">
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                {test.result}
            </div>
        </div>
    </div>
);

const CustomTestCard = ({ test }) => (
    <div className="mb-4 border rounded-lg shadow-sm bg-white text-black">
        <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">{test.name}</h3>
            <div className="text-sm text-gray-500">
                Завершён: {format(new Date(test.completed_at), "dd MMM yyyy HH:mm", { locale: ru })}
            </div>
        </div>
        <div className="p-4">
            <div className="space-y-4">
                {test.result.free_answers?.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">Свободные ответы:</h4>
                        {test.result.free_answers.map((answer, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                                <div className="font-medium text-sm">{answer.question_text}</div>
                                <div className="text-sm mt-1">{answer.answer_text}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {format(new Date(answer.timestamp), "dd MMM yyyy HH:mm:ss", { locale: ru })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {test.result.test_answers?.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">Тестовые ответы:</h4>
                        {test.result.test_answers.map((answer, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                                <div className="font-medium text-sm">{answer.question_text}</div>
                                <div className="text-sm mt-1">{answer.answer_text}</div>
                                <div className="flex justify-between items-center mt-1">
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(answer.timestamp), "dd MMM yyyy HH:mm:ss", { locale: ru })}
                                    </div>
                                    {answer.score !== null && (
                                        <div className={`text-sm font-medium ${answer.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            Балл: {answer.score}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {test.result.total_score !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                        <span className="font-medium">Итоговый балл:</span>
                        <span className={`font-bold ${test.result.total_score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {test.result.total_score}
                        </span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const TestPackCompletionDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { completion, filters } = location.state || {};

    useEffect(() => {
        const tg = window?.Telegram?.WebApp;

        if (tg) {
            // Показываем кнопку назад
            tg.BackButton.show();

            // Обработчик нажатия кнопки назад
            const handleBackButton = () => {
                navigate('/test-completions', {
                    state: {
                        activeTab: filters?.activeTab || '',
                        selectedTestPack: filters?.selectedTestPack || '',
                        currentPage: filters?.currentPage || 1,
                        pageSize: filters?.pageSize || 20
                    }
                });
            };

            // Подписываемся на событие
            tg.BackButton.onClick(handleBackButton);

            // Очистка при размонтировании
            return () => {
                tg.BackButton.offClick(handleBackButton);
                tg.BackButton.hide();
            };
        }
    }, [navigate, filters]);

    if (!completion) {
        return (
            <div className="p-4">
                <div className="text-center text-gray-500">Данные о прохождении не найдены</div>
            </div>
        );
    }

    const psychoTests = completion.completed_tests.filter(test => test.type === 'test');
    const customTests = completion.completed_tests.filter(test => test.type === 'custom');

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{completion.test_pack_name}</h1>
                <div className="flex gap-4 text-sm text-gray-600">
                    <span>Создан: {format(new Date(completion.created_at), "dd MMM yyyy HH:mm", { locale: ru })}</span>
                    <span>•</span>
                    <span>Обновлён: {format(new Date(completion.updated_at), "dd MMM yyyy HH:mm", { locale: ru })}</span>
                </div>
                <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${completion.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : completion.status === "ABANDONED"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}>
                        {completion.status === "COMPLETED"
                            ? "Завершено"
                            : completion.status === "ABANDONED"
                                ? "Отменено"
                                : "В процессе"}
                    </span>
                </div>
            </div>

            {psychoTests.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Психологические тесты</h2>
                    {psychoTests.map((test, index) => (
                        <PsychoTestCard key={`${test.id}-${index}`} test={test} />
                    ))}
                </div>
            )}

            {customTests.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Пользовательские тесты</h2>
                    {customTests.map((test, index) => (
                        <CustomTestCard key={`${test.id}-${index}`} test={test} />
                    ))}
                </div>
            )}

            {completion.pending_tests.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Ожидают выполнения</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                            {completion.pending_tests.map((test, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                    <span>{test.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestPackCompletionDetails;