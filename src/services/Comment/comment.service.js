import { get, post, remove } from '~api';
export const commentRoot = 'comment';
export const commentLikes = {
  commentLike: 'like',
  commentUnlike: 'unlike'
};

export const commentableTypes = {
  comment: 'comment',
  blogPost: 'blog post',
  reblog: 'reblog'
};

export const getComment = id => get(`${commentRoot}/${id}`, id);
export const createComment = payload => post(`${commentRoot}`, payload);
export const updateComment = (id, payload) =>
  post(`${commentRoot}/${id}`, payload);
export const commentLike = (id, payload) =>
  post(`${commentRoot}/${id}/${commentLikes.commentLike}`, payload);
export const commentDelete = (id, payload) =>
  remove(`${commentRoot}/${id}`, payload);
export const commentUnlike = (id, payload) =>
  post(`${commentRoot}/${id}/${commentLikes.commentUnlike}`, payload);
