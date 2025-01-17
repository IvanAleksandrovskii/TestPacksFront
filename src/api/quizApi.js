import axios from 'axios';


const BASE_URL = 'https://xefpmp-ip-49-228-96-123.tunnelmole.net';  // process.env.REACT_APP_API_BASE_URL || 


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

  // TODO: Here for editing feature
  // getTest: async (testId, creatorId) => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}/api/custom_test/${testId}`, {
  //       params: { creator_id: creatorId }
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching test:', error.response?.data || error.message);
  //     throw error;
  //   }
  // },
  getTest: async (testId, creatorId) => {
    const response = await axios.get(`${BASE_URL}/api/custom_test/${testId}`, {
      params: { creator_id: creatorId },
    });
    return response.data;
  },

  // updateTest: async (testId, testData) => {
  //   try {
  //     const response = await axios.put(`${BASE_URL}/custom_test_update/${testId}`, testData);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error updating test:', error.response?.data || error.message);
  //     throw error;
  //   }
  // },
  updateTest: async (testId, testData, creatorId) => {
    const response = await axios.put(`${BASE_URL}/api/custom_test_update/${testId}`, {
      creator_id: creatorId,
      ...testData, // Остальные данные теста
    });
    return response.data;
  },

  // Удалить тест с проверкой creator_id
  deleteTest: async (testId, creatorId) => {
    const response = await axios.delete(`${BASE_URL}/api/custom_test/${testId}`, {
      data: { creator_id: creatorId },
    });
    return response.data;
  },
};
