import { get } from '~api';
const root = 'newsfeed';

export const feedTypes = {
  news: 'news',
  blog: 'blog',
  community: 'community',
  tagged: 'tagged',
  likes: 'likes',
  comments: 'comments'
};

export const getNewsFeed = ({ pagination = 1, tagNames, order, noReblogs }) =>
  get(
    `${root}${tagNames ? `/tags/${tagNames}` : ''}${order ? `/${order}` : ''}${
      noReblogs ? '/no-reblogs' : ''
    }/${pagination}`
  );
