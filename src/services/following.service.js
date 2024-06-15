import { get } from '~api';
import { aliasRoot } from '@/services/alias.service';

export const followingRoot = 'Following';

// @TODO add functionality that can redirect us from unexpected url to user's blog

/*@TODO revise*/
export const followingAreas = {
  FollowingFollowing: `${followingRoot}Following`,
  FollowingRequests: `${followingRoot}Requests`
};

export const getFollowing = id => get(`${aliasRoot}/${id}/following`);
export const getBlocking = id => get(`${aliasRoot}/${id}/blocking`);

export const followableTypes = {
  blog: 'blog',
  community: 'community',
  tag: 'tag'
};
