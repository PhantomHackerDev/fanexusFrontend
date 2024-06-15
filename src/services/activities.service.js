import { get } from '~api';
const root = 'notifications';

export const activityTypes = {
  follow: 'follow',
  reblog: 'reblog',
  comment: 'comment',
  like: 'like',
  invite: 'invite',
  join: 'join',
  'accept-member': 'accept-member',
  'reblog-reblog': 'reblog',
  'comment-reblog': 'comment',
  'like-reblog': 'like'
};

export const likeableTypes = {
  comment: 'comment',
  blogPost: 'blog post',
  reblog: 'reblog'
};

export const getActivities = () => get(`${root}`);
export const getNewActivitiesCount = () => get(`${root}/new/count`);
export const watchActivitiesCount = cancelToken =>
  get(`${root}/new/count/watch`, { cancelToken });
export const unwatchActivitiesCount = () => get(`${root}/new/count/unwatch`);
