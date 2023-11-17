/* eslint-disable prettier/prettier */
import axios from 'axios';

const ApiService = axios.create({
  baseURL: 'http://localhost:3003',
});

export default ApiService;