// src/components/TestPackCompletionCard.jsx
import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const TestPackCompletionCard = ({ completion, onClick }) => {
    return (
        <div
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-semibold text-black">
                        Пакет тестов: {completion.test_pack_id}
                    </h3>
                    <p className={`text-sm ${
                        completion.status === "COMPLETED" 
                            ? "text-green-600" 
                            : completion.status === "ABANDONED" 
                            ? "text-red-600" 
                            : "text-blue-600"
                    }`}>
                        Статус: {completion.status.toLowerCase()}
                    </p>
                </div>
                <span className="text-sm text-gray-500">
                    {format(new Date(completion.updated_at), "dd MMM yyyy HH:mm", { locale: ru })}
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                    <p className="text-gray-600">
                        Ожидает: {completion.pending_tests.length}
                    </p>
                    <p className="text-gray-600">
                        Завершено: {completion.completed_tests.length}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500">
                        {completion.user_data.first_name} {completion.user_data.last_name}
                    </p>
                    <p className="text-gray-500 text-xs">
                        @{completion.user_data.username}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestPackCompletionCard;