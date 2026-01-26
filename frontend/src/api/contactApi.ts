import axios from 'axios';
// I add the 'type' keyword here to satisfy the verbatimModuleSyntax rule.
// This tells TypeScript that these are blueprints, not running code.
import type { Contact, ContactFormData } from '../types/contact';

const API_URL = 'http://localhost:5000/contacts';

export const contactApi = {
  // I use 'Promise<Contact[]>' to tell the code that I expect 
  // an array of contacts to come back from the server eventually.
  getAll: async (userId: number): Promise<Contact[]> => {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  },

  // I am combining the ContactFormData fields with the userId 
  // so the backend knows which user owns this new contact.
  create: async (data: ContactFormData & { userId: number }) => {
    return axios.post(API_URL, data);
  },

  // I use the ID in the URL to tell the server exactly which row to change.
  update: async (id: number, data: ContactFormData) => {
    return axios.put(`${API_URL}/${id}`, data);
  },

  // I send the ID of the contact I want to remove.
  delete: async (id: number) => {
    return axios.delete(`${API_URL}/${id}`);
  }
};