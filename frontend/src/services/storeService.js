import axios from 'axios';

const API_URL = '/api/stores/';

const getStores = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getStore = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

const getStoreRatings = async (id) => {
  const response = await axios.get(`${API_URL}${id}/ratings`);
  return response.data;
};

const storeService = {
  getStores,
  getStore,
  getStoreRatings,
};

export default storeService;