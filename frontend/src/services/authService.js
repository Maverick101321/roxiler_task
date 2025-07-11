import api from './api';

const API_URL = '/auth/';

const login = async (email, password) => {
  const response = await api.post(API_URL + 'login', {
    email,
    password,
  });

  return response.data;
};

const register = async (userData) => {
  const response = await api.post(API_URL + 'register', userData);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;