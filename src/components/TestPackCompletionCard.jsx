import React, { useState } from "react";
import Modal from "react-modal";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MessageSquare, Phone } from "lucide-react";

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
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg text-black">
                        Пакет тестов:{" "}
                        <span className="font-semibold">{completion.test_pack_name}</span>
                    </h3>
                    <p
                        className={`text-sm ${completion.status === "COMPLETED"
                                ? "text-green-600"
                                : completion.status === "ABANDONED"
                                    ? "text-red-600"
                                    : "text-blue-600"
                            }`}
                    >
                        Статус: {completion.status.toLowerCase()}
                    </p>
                </div>
                <span className="text-sm text-gray-500">
                    {format(new Date(completion.updated_at), "dd MMM yyyy HH:mm", {
                        locale: ru,
                    })}
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
                    {(firstName || lastName) && (
                        <p className="text-gray-500">
                            {firstName} {lastName}
                        </p>
                    )}
                    <div className="flex justify-end gap-2">
                        {username && (
                            <button
                                type="button"
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors duration-200 focus:outline-none flex items-center gap-1 text-xs"
                                onClick={handleUsernameClick}
                            >
                                <MessageSquare size={14} />
                                <span>@{username}</span>
                            </button>
                        )}
                        {phone && (
                            <button
                                type="button"
                                className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-md transition-colors duration-200 focus:outline-none flex items-center gap-1 text-xs"
                                onClick={handleCopyPhone}
                            >
                                <Phone size={14} />
                                <span>{phone}</span>
                            </button>
                        )}
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
                <div onClick={e => e.stopPropagation()}>
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