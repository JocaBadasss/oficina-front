import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // coloca aqui a URL do seu back-end
  withCredentials: true, // MUITO IMPORTANTE pro cookie funcionar!
});
