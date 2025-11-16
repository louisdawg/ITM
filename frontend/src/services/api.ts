import axios from 'axios';
import type { Dienstgrad, Statistik, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const hierarchieAPI = {
  getHierarchie: (): Promise<ApiResponse<Dienstgrad[]>> => 
    api.get('/hierarchie').then(response => response.data),
  
  getStatistiken: (): Promise<ApiResponse<Statistik[]>> => 
    api.get('/statistiken').then(response => response.data),
  
  getHealth: () => api.get('/health'),
};

export default api;