// src/api/testPacksApi.js

import axios from 'axios';

import { BASE_URL } from "./constants";


export const testPacksApi = {
    // Получаем список всех тест-паков конкретного пользователя (creator_id)
    async getPacks(creatorId) {
        // GET /test-packs/{creator_id}
        const response = await axios.get(`${BASE_URL}/api/test-packs/${creatorId}`);
        return response.data;  // ожидаем массив TestPackOut
    },

    // Получаем 1 тест-пак по UUID
    async getPack(packId) {
        // GET /test-packs/test_pack/{packId}
        const response = await axios.get(`${BASE_URL}/api/test-packs/test_pack/${packId}`);
        return response.data;  // TestPackOut (один объект)
    },

    // Создаём тест-пак (POST /test-packs/) 
    async createPack(data) {
        const response = await axios.post(`${BASE_URL}/api/test-packs/`, data);
        return response.data; // TestPackOut
    },

    // Обновляем тест-пак (PATCH)
    async updatePack(packId, data) {
        const response = await axios.patch(`${BASE_URL}/api/test-packs/test_pack/${packId}`, data);
        return response.data; // TestPackOut
    },

    // Удаляем тест-пак (DELETE)
    async deletePack(packId) {
        const response = await axios.delete(`${BASE_URL}/api/test-packs/test_pack/${packId}`);
        return response.data; // { detail: "Test pack deleted successfully" }
    },

    // Получаем список всех психологических тестов
    async getPsychologicalTests() {
        const response = await axios.get(`${BASE_URL}/api/psychological-tests/`);
        return response.data; // ожидаем массив TestOut
    },

    // Получаем список CustomTests
    async getCustomTests(creatorId) {
        const response = await axios.get(`${BASE_URL}/api/custom_tests/${creatorId}`);
        return response.data;
    },

    // Получаем список прохождений тестов пользователя
    getTestCompletions: async (userId, status, testPack = "", page = 1, page_size = 20) => {
        const params = {
            user_id: userId,
            status: status,
            page: page,
            page_size: page_size,
        };
        if (testPack) {
            params.test_pack = testPack;
        }
        const response = await axios.get(`${BASE_URL}/api/test-completions/`, { params });
        return response.data;
    },

    getAITrancription: async (userId, testPackCompletionId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/ai_transcription/`, {
                params: {
                    user_id: userId,
                    test_pack_completion_id: testPackCompletionId
                }
            });
            return response.data;
        } catch (error) {
            // Log the error details for debugging
            console.error('AI Transcription Error:', error.response?.data || error.message);
            throw error;
        }
    },

    clearAITranscription: async (userId, testPackCompletionId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/ai_transcription_clear/`, {
                params: {
                    user_id: userId,
                    test_pack_completion_id: testPackCompletionId
                }
            });
            return response.status === 204 ? null : response.data;
        } catch (error) {
            console.error('Clear AI Transcription Error:', error.response?.data || error.message);
            throw error;
        }
    },
};
