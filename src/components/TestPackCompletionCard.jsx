import React, { useState } from "react";
import Modal from "react-modal";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MessageSquare, Phone, Copy } from "lucide-react";

const renderValue = (value) => {
    return value === "Не указано" ? "" : value;
};

const TestPackCompletionCard = ({ completion, onClick }) => {
    const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);

    const userData = completion.user_data || {};

    const firstName = renderValue(userData.first_name);
    const lastName = renderValue(userData.last_name);
    const username = renderValue(userData.username);
    const phone = renderValue(userData.phone);

    const handleCopyUsername = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(username);
            if (window.Telegram?.WebApp?.showPopup) {
                window.Telegram.WebApp.showPopup({
                    message: "Юзернейм скопирован в буфер обмена",
                    buttons: [{ type: "close" }],
                });
            } else {
                alert("Юзернейм скопирован в буфер обмена");
            }
        } catch (err) {
            console.error("Ошибка при копировании юзернейма:", err);
        }
        setUsernameModalOpen(false);
    };

    const handleOpenChat = (e) => {
        e.stopPropagation();
        if (username) {
            window.Telegram.WebApp.openLink(`https://t.me/${username}`);
        }
        setUsernameModalOpen(false);
    };

    const handleCopyPhone = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(phone);
            if (window.Telegram?.WebApp?.showPopup) {
                window.Telegram.WebApp.showPopup({
                    message: "Телефон скопирован в буфер обмена",
                    buttons: [{ type: "close" }],
                });
            } else {
                alert("Телефон скопирован в буфер обмена");
            }
        } catch (err) {
            console.error("Ошибка при копировании телефона:", err);
        }
    };

    const handleUsernameClick = (e) => {
        e.stopPropagation();
        setUsernameModalOpen(true);
    };

    return (
        <div
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white space-y-3"
            onClick={() => onClick(completion)}
        >
            <div className="flex justify-between items-start">
                <div className="flex-grow max-w-full">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800 truncate pr-2">
                            {completion.test_pack_name}
                        </h3>
                        <p
                            className={`px-2 py-1 rounded text-xs font-medium ${completion.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : completion.status === "ABANDONED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                        >
                            {completion.status.toLowerCase().replace('_', ' ')}
                        </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">

                        <p className="text-gray-600 font-medium break-words" style={{ overflowWrap: 'anywhere' }}>
                            {firstName} {lastName}
                        </p>

                        <div className="flex gap-2 grid grid-cols-1 min-w-max">
                            {username && (
                                <button
                                    type="button"
                                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors flex items-center gap-1 text-xs"
                                    onClick={handleUsernameClick}
                                >
                                    <MessageSquare size={14} />
                                    <span>@{username}</span>
                                </button>
                            )}
                            {phone && (
                                <button
                                    type="button"
                                    className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-md transition-colors flex items-center gap-1 text-xs"
                                    onClick={handleCopyPhone}
                                >
                                    <Copy size={14} />
                                    <span>{phone}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="gap-4 text-sm bg-gray-50 p-3 rounded-lg text-black">
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Пройдено</span>
                        <span className="font-semibold">
                            {completion.completion_percentage}%
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Ожидает</span>
                        <span className="font-semibold">
                            {completion.pending_tests.length}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Завершено</span>
                        <span className="font-semibold">
                            {completion.completed_tests.length}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 border-t pt-1 mt-1">
                        <span>Обновлено:</span>
                        <span>
                            {format(new Date(completion.updated_at), "dd MMM yyyy HH:mm", {
                                locale: ru,
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Начало:</span>
                        <span>
                            {format(new Date(completion.created_at), "dd MMM yyyy HH:mm", {
                                locale: ru,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isUsernameModalOpen}
                onRequestClose={(e) => {
                    e.stopPropagation();
                    setUsernameModalOpen(false);
                }}
                className="bg-white p-4 rounded shadow-lg max-w-xs mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                shouldCloseOnOverlayClick={true}
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-semibold mb-4">Действия с юзернеймом</h2>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleCopyUsername}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                            Скопировать юзернейм
                        </button>
                        <button
                            onClick={handleOpenChat}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                        >
                            Перейти в чат
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setUsernameModalOpen(false);
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};


export default TestPackCompletionCard;
