import api from './api';

const API_URL = '/stores/';

const getStores = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const getStore = async (id) => {
  const response = await api.get(API_URL + id);
  return response.data;
};

const getStoreRatings = async (id) => {
  const response = await api.get(`${API_URL}${id}/ratings`);
  return response.data;
};

const addRating = async (storeId, ratingData) => {
  const response = await api.post(`${API_URL}${storeId}/ratings`, ratingData);
  return response.data;
};

const createStore = async (storeData) => {
  const response = await api.post(API_URL, storeData);
  return response.data;
};

const updateStore = async (id, storeData) => {
  const response = await api.put(API_URL + id, storeData);
  return response.data;
};

const deleteStore = async (id) => {
  const response = await api.delete(API_URL + id);
  return response.data;
};

const storeService = {
  getStores,
  getStore,
  getStoreRatings,
  addRating,
  createStore,
  updateStore,
  deleteStore,
};

export default storeService;