// src/api/testPacksApi.js

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'https://example.com';

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
};
