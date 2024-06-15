import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { getToken } from '@/services/jwt.service';
import { API_URL } from '@/services/config';
import store from '@/store/index';
import { updateBlogUrl, updateCommunityUrl } from '@/utils/regExp';

export const apiInit = () => {
  Vue.use(VueAxios, axios);
  Vue.axios.defaults.baseURL = API_URL;
  Vue.axios.defaults.withCredentials = true;
  setApiHeader();
  axios.interceptors.response.use(
    response => response.data,
    error => {
      // TODO: Try to consolidate these conditions
      if (
        error.message !== 'Canceling watch for new alias.' &&
        error.message !== 'Request aborted' &&
        !(
          error.config &&
          (error.config.url === 'users/login' ||
            error.config.url === 'users' ||
            error.config.url === 'image/upload' ||
            error.config.url.match(updateBlogUrl) ||
            error.config.url.match(updateCommunityUrl)) &&
          error.config.method === 'post'
        )
      ) {
        store.dispatch('addFlashMessage', { message: error, type: 'failure' });
      }
      return Promise.reject(error);
    }
  );
};

/*@TODO remove this function as well as the all mocks*/
export const getMocked = async (data, timeOut = 1000) => {
  return new Promise(resolve => setTimeout(() => resolve(data), timeOut));
};
export const setApiHeader = () => {
  const token = getToken();
  Vue.axios.defaults.headers.common['Authorization'] = token
    ? `Bearer ${getToken()}`
    : '';
};
export const get = (resource, config) => axios.get(resource, config);
export const put = (resource, payload) => axios.put(resource, payload);
export const patch = (resource, payload) => axios.patch(resource, payload);
export const post = (resource, payload) => axios.post(resource, payload);
export const remove = (resource, data) => axios.delete(resource, { data });

export default { apiInit, setApiHeader, get, post, patch, remove };
