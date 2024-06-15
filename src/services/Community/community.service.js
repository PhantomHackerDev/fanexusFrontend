import { get, post } from '~api';
export const communityRoot = 'community';
export const membersRoot = 'members';
export const moderatorsRoot = 'moderators';
export const addToCommunity = 'add';
export const joinCommunityRoot = 'requests/create';
export const removeFromCommunityRoot = 'remove';
export const inviteMemberRoot = 'invites';
export const communityRequestsRoot = 'members/requests';
export const communityInvitesRoot = 'members/invites';
export const myCommunityRoot = 'mycommunities/list';

// @TODO add functional that can redirect us from unexpected url to user's blog

/*@TODO revise*/
export const communityAreas = {
  posts: `${communityRoot}-all-posts`,
  members: `${communityRoot}-members`,
  moderators: `${communityRoot}-moderators`,
  rules: `${communityRoot}-rules`,
  settings: `${communityRoot}-settings`,
  requests: `${communityRoot}-requests`,
  createRules: `${communityRoot}-create-rules`,
  edit: `${communityRoot}-edit-community`
};

export const communityEditAreas = {
  profile: 'community-profile',
  settings: 'community-settings'
};

/** @TODO make it common between blog and community */
export const blogImageTypes = {
  coverImage: 'coverImage',
  avatar: 'avatar'
};

export const getCommunity = ({
  name,
  pagination,
  tagNames,
  order,
  noReblogs,
  id
}) =>
  get(
    `${communityRoot}/${encodeURIComponent(name)}${id ? '/id' : ''}${
      tagNames ? `/tags/${encodeURIComponent(tagNames)}` : ''
    }${order ? `/${order}` : ''}${noReblogs ? '/no-reblogs' : ''}/${pagination}`
  );
export const createCommunity = payload => post(`${communityRoot}`, payload);
export const editCommunity = (id, payload) =>
  post(`${communityRoot}/${id}`, payload);
export const getModerators = (id, pagination, filterBy) =>
  get(`${communityRoot}/${id}/${moderatorsRoot}/${pagination}`, {
    params: filterBy && { filterBy }
  });
export const getMembers = (id, pagination, filterBy) =>
  get(`${communityRoot}/${id}/${membersRoot}/${pagination}`, {
    params: filterBy && { filterBy }
  });
export const joinCommunity = (id, payload) =>
  post(`${communityRoot}/${id}/${membersRoot}/${joinCommunityRoot}`, payload);
export const removeMemberFromCommunity = (id, payload) =>
  post(
    `${communityRoot}/${id}/${membersRoot}/${removeFromCommunityRoot}`,
    payload
  );
export const inviteMember = (id, payload) =>
  post(`${communityRoot}/${id}/${membersRoot}/${inviteMemberRoot}`, payload);
export const addModerators = (id, payload) =>
  post(`${communityRoot}/${id}/${moderatorsRoot}/${addToCommunity}`, payload);
export const removeModerators = (id, payload) =>
  post(
    `${communityRoot}/${id}/${moderatorsRoot}/${removeFromCommunityRoot}`,
    payload
  );
export const getCommunityRequests = (id, pagination, payload) =>
  post(
    `${communityRoot}/${id}/${communityRequestsRoot}/${pagination}`,
    payload
  );
export const declineRequest = (id, payload) =>
  post(`${communityRoot}/${id}/${communityRequestsRoot}/reject`, payload);
export const acceptRequest = (id, payload) =>
  post(`${communityRoot}/${id}/${communityRequestsRoot}/accept`, payload);
export const myCommunities = () => get(`${communityRoot}/${myCommunityRoot}`);

export const acceptInvite = id =>
  get(`${communityRoot}/${id}/${communityInvitesRoot}/accept`);
export const rejectInvite = id =>
  get(`${communityRoot}/${id}/${communityInvitesRoot}/reject`);
