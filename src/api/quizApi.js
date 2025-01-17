import axios from 'axios';


const BASE_URL = 'https://rzop47-ip-49-228-96-123.tunnelmole.net';

export const quizApi = {
  createTest: async (testData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/custom_tests/`, testData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
