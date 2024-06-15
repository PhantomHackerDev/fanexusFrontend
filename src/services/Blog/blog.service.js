import { get, post, remove } from '~api';
export const blogRoot = 'blog';
const sharingRoot = 'sharing';
const root = 'blogPost';
import store from '@/store/index';

export const blogModalTypes = {
  createPrivacyGroup: 'createPrivacyGroup',
  mobileDescriptionModal: 'mobileDescriptionModal'
};

export const blogLikes = {
  postLike: 'like',
  postUnlike: 'unlike'
};

/** @TODO make it common between blog and community */
export const blogImageTypes = {
  coverImage: 'coverImage',
  avatar: 'avatar'
};

export const blogAreas = {
  allPosts: `${blogRoot}-all-posts`,
  settings: `${blogRoot}-settings`,
  followers: `${blogRoot}-followers`,
  following: `${blogRoot}-following`,
  likes: `${blogRoot}-likes`,
  privacyGroup: `${blogRoot}-privacy-group`,
  mobileTags: `${blogRoot}-mobile-tags`
};

import {
  createFollow,
  deleteFollow,
  createBlock,
  deleteBlock
} from '@/services/follow.service';
export const groupComponentActions = {
  follow: {
    create: {
      label: 'Follow',
      async action(...params) {
        await createFollow(...params);
        store.dispatch('addToStat', { stat: 'followingCount', change: 1 });
      }
    },
    destroy: {
      label: 'Unfollow',
      async action(...params) {
        await deleteFollow(...params);
        store.dispatch('addToStat', { stat: 'followingCount', change: -1 });
      }
    }
  },
  block: {
    create: {
      label: 'Block',
      action: createBlock
    },
    destroy: {
      label: 'Unblock',
      action: deleteBlock
    }
  }
};

export const blogEditAreas = {
  profile: 'blog-profile',
  settings: 'blog-settings'
};

export const editBlog = (id, payload) => post(`${blogRoot}/${id}`, payload);
export const getBlogData = ({
  name,
  pagination,
  tagNames,
  order,
  noReblogs,
  id
}) =>
  get(
    `${blogRoot}/${encodeURIComponent(name)}${id ? '/id' : ''}${
      tagNames ? `/tags/${encodeURIComponent(tagNames)}` : ''
    }${order ? `/${order}` : ''}${noReblogs ? '/no-reblogs' : ''}/${pagination}`
  );
export const getBlogFollowersCount = name =>
  get(`${blogRoot}/${name}/followedBy/count`);
export const getBlogLikesCount = name => get(`${blogRoot}/${name}/likes/count`);
export const getEligibleShareToEntitiesForAlias = payload =>
  post(`${root}/${sharingRoot}/getEligibleShareToEntitiesForAlias`, payload);
/** @TODO move all BlogPost related apis to a separate blogPost.service.js */
export const getBlogPost = id => get(`${root}/${id}`);
export const createBlogPost = payload => post(root, payload);
export const editBlogPost = (id, payload) => post(`${root}/${id}`, payload);
export const deleteBlogPost = (id, payload) => remove(`${root}/${id}`, payload);
export const postLike = (id, payload) =>
  post(`${root}/${id}/${blogLikes.postLike}`, payload);
export const postUnlike = (id, payload) =>
  post(`${root}/${id}/${blogLikes.postUnlike}`, payload);
