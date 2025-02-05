// src/pages/TestPackList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { Share2, Pencil, Trash2} from "lucide-react";

import { testPacksApi } from "../api/testPacksApi";
import { BOT_USERNAME } from "../api/constants";
import LoadingSpinner from "../components/LoadingSpinner";


Modal.setAppElement("#root");


const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onCancel}
        className="fixed inset-0 flex items-center justify-center z-50"
    >
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">
                Are you sure you want to delete this pack?
            </h2>
            <div className="flex justify-around mt-4 grid grid-cols-2 gap-2">
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={onConfirm}
                >
                    Yes
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    No
                </button>
            </div>
        </div>
    </Modal>
);


function TestPackList({ creatorId }) {
    const navigate = useNavigate();
    const [packs, setPacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [packToDelete, setPackToDelete] = useState(null);

    useEffect(() => {
        if (!creatorId) return;
        loadPacks();
    }, [creatorId]);

    async function loadPacks() {
        setIsLoading(true);
        try {
            const data = await testPacksApi.getPacks(creatorId);
            setPacks(data);
        } catch (error) {
            console.error("Failed to fetch test packs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleShare = async (packID) => {
        const link = `https://t.me/${BOT_USERNAME}?start=${packID}`;
        try {
            await navigator.clipboard.writeText(link);
            window.Telegram.WebApp.showPopup({
                message: "Ссылка скопирована в буфер обмена",
                buttons: [{ type: 'close' }]
            });
        } catch (err) {
            console.error("Failed to copy link:", err);
            window.Telegram.WebApp.showPopup({
                message: "Произошла ошибка при копировании ссылки",
                buttons: [{ type: 'close' }]
            });
        }
    };

    if (isLoading) return <LoadingSpinner />;

    const MAX_PACKS = 10;
    const isLimitReached = packs.length >= MAX_PACKS;

    const openModal = (packId) => {
        setPackToDelete(packId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setPackToDelete(null);
    };

    const handleDelete = async () => {
        if (!packToDelete) return;
        try {
            await testPacksApi.deletePack(packToDelete);
            setPacks((prev) => prev.filter((p) => p.id !== packToDelete));
        } catch (error) {
            console.error("Failed to delete test pack:", error);
        } finally {
            closeModal();
        }
    };

    return (
        <div className="p-2 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">My Test Packs</h1>

            <ul className="space-y-4">
                {packs.map((pack) => (
                    <li
                        key={pack.id}
                        className="flex flex-col p-4 border rounded shadow-sm bg-white hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <span
                                    className="text-lg font-medium break-words"
                                    style={{
                                        color: "black",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        hyphens: "auto",
                                    }}
                                >
                                    {pack.name}
                                </span>
                                <div className="flex flex-col gap-1 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <span>{pack.tests?.length || 0} psychological tests</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>{pack.custom_tests?.length || 0} custom tests</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleShare(pack.id)}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                                    title="Share pack"
                                >
                                    <Share2 size={20} />
                                </button>
                                <button
                                    onClick={() => openModal(pack.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete pack"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={() => navigate(`/packs/edit/${pack.id}`)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Edit pack"
                                >
                                    <Pencil size={20} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
                {packs.length === 0 && (
                    <p className="text-center text-gray-500">No test packs created yet</p>
                )}
            </ul>

            <button
                onClick={() => !isLimitReached && navigate("/packs/create")}
                disabled={isLimitReached}
                className={`px-4 py-2 w-full rounded mb-8 mt-4 text-white ${isLimitReached
                    ? "bg-gray-500 cursor-not-allowed hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                    }`}
            >
                {isLimitReached ? "To create a pack delete one" : "Create Test Pack"}
            </button>

            <DeleteConfirmation
                isOpen={isModalOpen}
                onConfirm={handleDelete}
                onCancel={closeModal}
            />
        </div>
    );
}

export default TestPackList;
