import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export function getNotes(search = '') {
  return api.get('/notes', { params: search.trim() ? { search: search.trim() } : {} }).then(({ data }) => data);
}

export function createNote(note) {
  return api.post('/notes', note).then(({ data }) => data);
}

export function updateNote(id, note) {
  return api.put(`/notes/${id}`, note).then(({ data }) => data);
}

export function deleteNote(id) {
  return api.delete(`/notes/${id}`);
}

export function getErrorMessage(error) {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  if (error.request) return 'Cannot reach the notes server. Check that the backend is running.';
  return 'Something went wrong. Please try again.';
}
