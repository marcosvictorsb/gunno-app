import axios from 'axios';
import router from '../router';
import store from '../store';

const ApiService = axios.create({
  baseURL: 'http://localhost:3000'
});

ApiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(error);
    if (error.response.status === 401) {
      store.dispatch('logout');
      store.resetState('logout');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default ApiService;
