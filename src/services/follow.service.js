import { put, remove } from '~api';
export const followRoot = 'follow';
export const blockRoot = 'block';

export const createFollow = (id, entity) =>
  put(`${followRoot}/${entity}/${id}`);
export const deleteFollow = (id, entity) =>
  remove(`${followRoot}/${entity}/${id}`);

export const createBlock = (id, entity, payload) =>
  put(`${blockRoot}/${entity}/${id}`, payload);
export const deleteBlock = (id, entity, payload) =>
  remove(`${blockRoot}/${entity}/${id}`, payload);

export const followableTypes = {
  blog: 'blog',
  community: 'community',
  tag: 'tag'
};
