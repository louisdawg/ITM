import axios from 'axios';
import type { Dienstgrad, Statistik } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const hierarchieAPI = {
  getHierarchie: () => api.get<{ success: boolean; data: Dienstgrad[] }>('/hierarchie'),
  getStatistiken: () => api.get<{ success: boolean; data: Statistik[] }>('/statistiken'),
  getHealth: () => api.get('/health'),
};