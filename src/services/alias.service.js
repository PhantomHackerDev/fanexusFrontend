import { get, patch, post } from '~api';

export const blogRoot = 'blog';
export const aliasRoot = 'alias';
const aliasMy = 'my';
const aliasSet = 'set';
const aliasPart = 'findLike';

export const getMyBlog = payload =>
  post(`${aliasRoot}/${aliasMy}/${blogRoot}`, payload);
export const getUserAliases = () => get(`${aliasRoot}/${aliasMy}`);
export const createNewAlias = payload => post(`${aliasRoot}`, payload);
export const updateAlias = (id, payload) => post(`${aliasRoot}/${id}`, payload);
export const setActiveAliasApi = id => patch(`${aliasRoot}/${aliasSet}/${id}`);
export const getActiveAliasDataApi = id => get(`${aliasRoot}/${id}`);
export const getAliasFollowingCount = id =>
  get(`${aliasRoot}/${id}/following/count`);
export const findAliases = payload =>
  post(`${aliasRoot}/${aliasPart}`, payload);
export const getInvites = () => get(`${aliasRoot}/${aliasMy}/invites`);
