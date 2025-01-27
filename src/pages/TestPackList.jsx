// src/pages/TestPackList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import { testPacksApi } from "../api/testPacksApi";

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

const TestPackList = ({ creatorId }) => {
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

    if (isLoading) {
        return <div className="text-center text-gray-500 mt-12">Loading...</div>;
    }

    // Лимит в 5 паков (как в custom test)
    const MAX_PACKS = 5;
    const isLimitReached = packs.length >= MAX_PACKS;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">My Test Packs</h1>

            <ul className="space-y-4">
                {packs.map((pack) => (
                    <li
                        key={pack.id}
                        className="flex flex-col p-4 border rounded shadow-sm bg-white"
                    >
                        <span className="text-lg font-medium mb-3" style={{ color: "black" }}>
                            {pack.name}
                        </span>
                        <div className="flex justify-end gap-1 mt-2 grid grid-cols-2 gap-2">
                            <button
                                onClick={() => openModal(pack.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => navigate(`/packs/edit/${pack.id}`)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Edit
                            </button>
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
                className={`px-4 py-2 w-full rounded mb-4 mt-4 text-white ${isLimitReached
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
};

export default TestPackList;
