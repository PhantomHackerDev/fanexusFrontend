import { get, post } from '~api';
const root = 'users';
export const authRoot = 'auth';

export const authAreas = {
  login: `${authRoot}-login`,
  createUser: `${authRoot}-create-account`,
  resetPassword: `${authRoot}-reset-password`,
  passEmail: `${authRoot}-pass-email`
};

export const login = payload => post(`${root}/login`, payload);
export const createUser = payload => post(`${root}`, payload);
export const updateUser = (id, payload) => post(`${root}/${id}`, payload);
export const getCurrentUser = () => get(`${root}/me`);
export const logout = () => post(`${root}/me/logout`);
export const logoutAll = () => post(`${root}/me/logoutall`);
export const requestPasswordReset = email =>
  post(`${root}/requestPasswordReset`, { email });
export const passwordReset = ({ resetKey, password }) =>
  post(`${root}/resetPassword`, { resetKey, password });
