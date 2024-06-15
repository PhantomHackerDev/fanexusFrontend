import { get, post, put, patch, remove } from '~api';
export const tagRoot = 'tag';
const tagWranglingRoot = 'tagWrangling';

export const tagLengthLimit = 512;
export const tagLengthErrorMessage = tagByteLength =>
  `Tag too long: your tag byte length was ${tagByteLength}, but it needs to be under ${tagLengthLimit}.`;

export const getTag = name =>
  get(`${tagRoot}/${encodeURIComponent(name)}/info`);
export const findTags = synonym =>
  get(`${tagRoot}/${encodeURIComponent(synonym)}`);
export const createTag = (name, payload) =>
  put(`${tagRoot}/${encodeURIComponent(name)}`, payload);
export const editTag = (name, payload) =>
  patch(`${tagRoot}/${encodeURIComponent(name)}`, payload);

export const reassignTag = (donorTagId, receivingTagId) =>
  post(`${tagWranglingRoot}`, { donorTagId, receivingTagId });
export const deleteTag = deleteId => remove(`${tagRoot}/${deleteId}`);

export const getTaggedBlogPosts = ({ tagNames, pagination, order }) =>
  get(
    `${tagRoot}/${encodeURIComponent(tagNames)}/blogPosts${
      order ? `/${order}` : ''
    }/${pagination}`
  );
export const getTaggedBlogs = tagNames =>
  get(`${tagRoot}/${encodeURIComponent(tagNames)}/blogs`);
export const getTaggedCommunities = tagNames =>
  get(`${tagRoot}/${encodeURIComponent(tagNames)}/communities`);
