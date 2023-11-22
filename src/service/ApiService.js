/* eslint-disable prettier/prettier */
import axios from 'axios';

const ApiService = axios.create({
  baseURL: 'https://gunno-api.onrender.com/',
});

export default ApiService;