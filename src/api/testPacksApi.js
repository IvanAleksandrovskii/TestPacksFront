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

    // Добавляем метод getCustomTests:  // TODO: Doublecheck
    async getCustomTests(creatorId) {
        // Предположим, у вас на бэкенде есть эндпоинт:
        //   GET /api/custom_tests/{creatorId}
        // который возвращает список кастомных тестов конкретного пользователя
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
};
