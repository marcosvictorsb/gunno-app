import axios from 'axios';
import router from '../router';

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
      console.log(router);
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default ApiService;
