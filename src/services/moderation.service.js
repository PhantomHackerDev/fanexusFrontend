import { get } from '~api';
const root = 'moderation-action';

export const moderationDeletions = {
  blogPost: 'blog-post',
  comment: 'comment'
};

export const getModerationActions = () => get(`${root}`);
