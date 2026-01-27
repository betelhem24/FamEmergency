import axios from 'axios';
import type { Contact, ContactFormData } from '../types/contact';

const API_URL = 'http://localhost:5000/contacts';

export const contactApi = {
  // I ensure userId is treated as a number
  getAll: async (userId: number): Promise<Contact[]> => {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  },

  // I explicitly define the data structure here to avoid the string/number error
  create: async (data: { name: string; phone: string; relation: string; userId: number }) => {
    return axios.post(API_URL, data);
  },

  update: async (id: number, data: ContactFormData) => {
    return axios.put(`${API_URL}/${id}`, data);
  },

  delete: async (id: number) => {
    return axios.delete(`${API_URL}/${id}`);
  }
};