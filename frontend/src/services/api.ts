import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Unit {
  id: number;
  name: string;
  type: string;
  level: number;
  branch_name: string;
  personnel_count: number;
  parent_unit_id?: number;
  location?: string;
  founded_year?: number;
  path?: string;
}

export interface Personnel {
  id: number;
  name: string;
  rank: string;
  rang_code: string;
  position: string;
  unit_name: string;
  service_number: string;
}

export interface Branch {
  id: number;
  name: string;
  description: string;
}

export const apiService = {
  getOrganisation: () => api.get<{
    error: string; success: boolean; data: Unit[] 
}>('/organisation'),
  getUnits: () => api.get<{ success: boolean; data: Unit[] }>('/units'),
  getBranches: () => api.get<{ success: boolean; data: Branch[] }>('/branches'),
  getPersonnel: (unitId: number) => api.get<{ success: boolean; data: Personnel[] }>(`/personnel/${unitId}`),
  getRanks: () => api.get<{ success: boolean; data: any[] }>('/ranks'),
  getHealth: () => api.get('/health'),
  getTest: () => api.get('/test'),
};

export default api;