import { ACCESS_TOKEN_KEY } from './storage.service.js';

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const hasToken = () => !!getToken();
export const saveToken = token => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const destroyToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);
