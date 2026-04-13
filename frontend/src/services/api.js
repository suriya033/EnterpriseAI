import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/_/backend/api',
});

export const documentService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData);
  },
  scrape: (url) => api.post('/documents/scrape', { url }),
  list: () => api.get('/documents/list'),
};

export const chatService = {
  query: (message, history) => api.post('/chat/query', { message, history }),
};

export default api;
