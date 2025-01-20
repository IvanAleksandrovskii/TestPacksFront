import axios from 'axios';


const BASE_URL = 'https://o1f4o0-ip-49-228-104-78.tunnelmole.net';  // process.env.REACT_APP_API_BASE_URL || 


export const quizApi = {
  createTest: async (testData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/custom_test/`, testData);
      return response.data;
    } catch (error) {
      console.error('Error creating test:', error.response?.data || error.message);
      throw error;
    }
  },

  getTests: async (creatorId) => {
    const response = await axios.get(`${BASE_URL}/api/custom_tests/${creatorId}`);
    return response.data;
  },

  getTest: async (testId, creatorId) => {
    const response = await axios.get(`${BASE_URL}/api/custom_test/${testId}`, {
      params: { creator_id: Number(creatorId) },
    });
    return response.data;
  },

  updateTest: async (testId, testData, creatorId) => {
    const response = await axios.put(
      `${BASE_URL}/api/custom_test_update/${testId}`, 
      testData,  // Send just the test data in the body
      {
        params: { creator_id: Number(creatorId) }  // Send creator_id as query param
      }
    );
    return response.data;
  },

  // Удалить тест с проверкой creator_id
  deleteTest: async (testId, creatorId) => {
    const response = await axios.delete(`${BASE_URL}/api/custom_test/${testId}`, {
        params: { creator_id: Number(creatorId) }, // Передаём как параметр запроса
    });
    return response.data;
  },
};
