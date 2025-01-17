// src/pages/TestList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import { quizApi } from "../api/quizApi";


Modal.setAppElement("#root");


const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }) => (
    <Modal isOpen={isOpen} onRequestClose={onCancel} style={modalStyles}>
        <h2>Вы уверены, что хотите удалить этот тест?</h2>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
            <button style={styles.confirmButton} onClick={onConfirm}>Да</button>
            <button style={styles.cancelButton} onClick={onCancel}>Нет</button>
        </div>
    </Modal>
);


const TestList = ({ tgUser }) => {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [testToDelete, setTestToDelete] = useState(null); // ID теста для удаления
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            setIsLoading(true);
            try {
                const response = await quizApi.getTests(tgUser.id);
                setTests(response);
            } catch (error) {
                console.error("Failed to fetch tests", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (tgUser && tgUser.id !== 111) {
            fetchTests();
        }
    }, [tgUser]);

    const handleDelete = async () => {
        if (!testToDelete) return;
        try {
            await quizApi.deleteTest(testToDelete, tgUser.id);
            setTests(tests.filter((test) => test.id !== testToDelete));
        } catch (error) {
            console.error("Failed to delete test", error);
        } finally {
            setModalOpen(false);
            setTestToDelete(null);
        }
    };

    const openModal = (testId) => {
        setTestToDelete(testId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTestToDelete(null);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>My Tests</h1>
            <button onClick={() => navigate("/create")}>Create Test</button>
            <ul>
                {tests.map((test) => (
                    <li key={test.id}>
                        <span>{test.name}</span>
                        <br />
                        <button onClick={() => navigate(`/edit/${test.id}`)}>Edit</button>
                        <button onClick={() => openModal(test.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <DeleteConfirmation
                isOpen={isModalOpen}
                onConfirm={handleDelete}
                onCancel={closeModal}
            />
        </div>
    );
};


const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
    },
};


const styles = {
    confirmButton: {
        backgroundColor: "red",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    cancelButton: {
        backgroundColor: "gray",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};


export default TestList;